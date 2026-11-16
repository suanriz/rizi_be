const bcrypt = require('bcrypt')
const config = require('../config/index')
const { dataSource } = require('../db/data-source')
const { seedGoods } = require('./seed-goods')

const runSeed = async () => {
  try {
    await dataSource.initialize()
    console.warn('🔌 資料庫連線成功，開始寫入 Seed Data...')

    const roleRepo = dataSource.getRepository('Role')
    const defaultRoles = ['工程師', '最高管理者', '管理者', '運營', '員工']
    for (const label of defaultRoles) {
      const exists = await roleRepo.findOneBy({ label })
      if (!exists) {
        await roleRepo.save({ label })
      }
    }
    console.warn('✅ 角色 (roles) 寫入完成')

    const statusRepo = dataSource.getRepository('OrderStatus')
    const defaultStatuses = ['新訂單', '待出貨', '已完成', '已取消']
    for (const label of defaultStatuses) {
      const exists = await statusRepo.findOneBy({ label })
      if (!exists) {
        await statusRepo.save({ label })
      }
    }
    console.warn('✅ 訂單狀態 (order_statuses) 寫入完成')

    const categoryRepo = dataSource.getRepository('GoodsCategory')
    const defaultCategories = [
      { id: 1, label: '淺焙咖啡' },
      { id: 2, label: '中焙咖啡' },
      { id: 3, label: '深焙咖啡' },
      { id: 4, label: '咖啡禮盒' }
    ]
    for (const category of defaultCategories) {
      const exists = await categoryRepo.findOneBy({ id: category.id })
      await categoryRepo.save(exists ? { ...exists, label: category.label } : category)
    }
    console.warn('✅ 商品分類 (goods_categories) 寫入完成')

    const tagRepo = dataSource.getRepository('GoodsTag')
    const defaultTags = [
      { id: 1, label: '首頁' },
      { id: 2, label: 'NEW' }
    ]
    for (const tag of defaultTags) {
      const exists = await tagRepo.findOneBy({ id: tag.id })
      await tagRepo.save(exists ? { ...exists, label: tag.label } : tag)
    }
    console.warn('✅ 商品標籤 (goods_tags) 寫入完成')

    const newsCategoryRepo = dataSource.getRepository('NewsCategory')
    const defaultNewsCategories = ['優惠', '活動']
    for (const label of defaultNewsCategories) {
      const exists = await newsCategoryRepo.findOneBy({ label })
      if (!exists) {
        await newsCategoryRepo.save({ label })
      }
    }
    console.warn('✅ 最新消息分類 (news_categories) 寫入完成')

    const userRepo = dataSource.getRepository('User')
    const { email: adminEmail, password: adminPassword } = config.admin

    if (!adminEmail || !adminPassword) {
      console.warn('⚠️ 未在 .env 設定 ADMIN_EMAIL 或 ADMIN_PASSWORD，跳過建立預設管理員')
    } else {
      const adminExists = await userRepo.findOneBy({ email: adminEmail })
      if (!adminExists) {
        const superAdminRole = await roleRepo.findOneBy({ label: '最高管理者' })
        const hashedPassword = await bcrypt.hash(adminPassword, 10)

        await userRepo.save({
          accountType: 'staff',
          email: adminEmail,
          name: 'Mori',
          password: hashedPassword,
          status: true,
          roleId: superAdminRole.id,
          remark: '系統預設最高管理者'
        })
        console.warn(`✅ 預設管理員建立完成 (帳號: ${adminEmail})`)
      }
    }

    const seedUpdater = adminEmail
      ? await userRepo.findOneBy({ email: adminEmail })
      : null
    const goodsCount = await seedGoods(dataSource, seedUpdater?.id)
    console.warn(`✅ 商品與商品關聯資料寫入完成 (${goodsCount} 筆)`)

    console.warn('🎉 所有 Seed Data 寫入完畢！')
  } catch (error) {
    console.error('❌ Seed Data 寫入失敗：', error)
    process.exitCode = 1
  } finally {
    if (dataSource.isInitialized) {
      await dataSource.destroy()
    }
  }
}

runSeed()
