module.exports = (sequelize, DataTypes) => sequelize.define(
  'sys_roles',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true // 主键
    },
    roleName: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'role_name'
    },
    roleCode: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'role_code'
    }
  },
  {
    tableName: 'sys_roles',
    timestamps: false
  },
)
