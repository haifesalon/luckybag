const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return userRoleView.init(sequelize, DataTypes);
}

class userRoleView extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('userRoleView', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'UserId'
    },
    realName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'RealName'
    },
    nickName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'NickName'
    },
    account: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Account'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Password'
    },
    userIsEnabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      field: 'UserIsEnabled'
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'RoleId'
    },
    roleName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'RoleName'
    }
  }, {
    tableName: 'User_Role_View',
    schema: 'dbo',
    timestamps: false
  });
  }
}
