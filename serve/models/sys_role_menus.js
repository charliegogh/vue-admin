module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'sys_role_menus',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true // 主键
      },
      role_id: {
        type: DataTypes.STRING,
        allowNull: true
      },
      menu_id: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'sys_role_menus',
      timestamps: false
    }
  )
