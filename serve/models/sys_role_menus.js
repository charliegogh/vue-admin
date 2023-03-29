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
        allowNull: true,
        unique: true // 唯一
      },
      menu_id: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true // 唯一
      },
      menu_code: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'sys_role_menus',
      timestamps: false
    }
  )
