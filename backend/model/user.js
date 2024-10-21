const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return user.init(sequelize, DataTypes);
}

class user extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('user', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
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
    authError: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      field: 'AuthError'
    },
    isEnabled: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: 1,
      field: 'IsEnabled'
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'LastLogin'
    },
    modifyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'ModifyId'
    },
    modifyTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate'),
      field: 'ModifyTime'
    },
    createId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'CreateId'
    },
    createTime: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.Sequelize.fn('getdate'),
      field: 'CreateTime'
    }
  }, {
    tableName: 'User',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_User",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  }
}
