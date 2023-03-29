module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'sys_dic_value',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true // 主键
      },
      did: {
        type: DataTypes.STRING,
        allowNull: true
      },
      value: {
        type: DataTypes.STRING,
        allowNull: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      orderNo: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'oder_no'
      },
      remark: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createTime: {
        type: DataTypes.STRING,
        allowNull: true,
        field: 'create_time'
      }
    },
    {
      tableName: 'sys_dic_value',
      timestamps: false //
    }
  )
