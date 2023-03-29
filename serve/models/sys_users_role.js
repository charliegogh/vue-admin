module.exports = (sequelize, DataTypes) => sequelize.define(
  'sys_users_role',
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true // 主键
    },
    role_id: {
      type: DataTypes.STRING,
      allowNull: true
    },
    user_id: {
      type: DataTypes.STRING,
      allowNull: true
    }
  },
  {
    tableName: 'sys_users_role',
    timestamps: false
  },
)
