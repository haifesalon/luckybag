const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return rolePageActionView.init(sequelize, DataTypes);
}

class rolePageActionView extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('rolePageActionView', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
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
    },
    pageId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'PageId'
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'DisplayName'
    },
    path: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Path'
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ParentId'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'Sort'
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Icon'
    },
    actionId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ActionId'
    },
    actionName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'ActionName'
    }
  }, {
    tableName: 'Role_Page_Action_View',
    schema: 'dbo',
    timestamps: false
  });
  }
}
