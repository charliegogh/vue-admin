module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'sys_menus',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true // 主键
      },
      pid: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      pageUrl: {
        type: DataTypes.STRING,
        allowNull: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      icon: {
        type: DataTypes.STRING,
        allowNull: true
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      orderNo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'order_no'
      }
    },
    {
      tableName: 'sys_menus',
      timestamps: false
    }
  )
