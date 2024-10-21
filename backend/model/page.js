const Sequelize = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  return page.init(sequelize, DataTypes);
}

class page extends Sequelize.Model {
  static init(sequelize, DataTypes) {
  return sequelize.define('page', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      field: 'ID'
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'Name'
    },
    displayName: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
      defaultValue: 0,
      field: 'ParentId'
    },
    sort: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
      field: 'Sort'
    },
    icon: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'Icon'
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
    tableName: 'Page',
    schema: 'dbo',
    timestamps: false,
    indexes: [
      {
        name: "PK_Page",
        unique: true,
        fields: [
          { name: "ID" },
        ]
      },
    ]
  });
  }
}
