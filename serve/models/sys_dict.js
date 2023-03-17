module.exports = (sequelize, DataTypes) =>
  sequelize.define(
    'sys_dict',
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true // 主键
      },
      parentId: {
        type: DataTypes.STRING,
        allowNull: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true
      },
      sort: {
        type: DataTypes.STRING,
        allowNull: true
      },
      code: {
        type: DataTypes.STRING,
        allowNull: true
      },
      dictType: {
        type: DataTypes.STRING,
        allowNull: true
      },
      createTime: {
        type: DataTypes.STRING,
        allowNull: true
      }
    },
    {
      tableName: 'sys_dict',
      timestamps: false //
      // updatedAt: 'updatedTime',
      // createdAt: 'createdTime' // 将createdAt设为自定义字段createdTime
    }
  )
