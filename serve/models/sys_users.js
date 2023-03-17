module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    'sys_users',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true // 主键
      },
      username: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'sys_users',
      timestamps: false
    },
  )
}
