module.exports = {
  port: 3000, // 服务器端口
  sequelize: {
    username: 'root',
    password: 'gcl@123',
    database: 'vue-admin',
    host: '47.93.4.29',
    dialect: 'mysql',
    define: {
      underscored: false,
      paranoid: true
    }
  },
  token: 'charlie'
}
