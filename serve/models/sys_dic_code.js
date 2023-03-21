module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'sys_dic_code',
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
      code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dictType: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'dic_type'
      },
      orderNo: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'order_no'
      },
      remark: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      createTime: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'create_time'
      }
    },
    {
      tableName: 'sys_dic_code',
      timestamps: false
    }
  )
