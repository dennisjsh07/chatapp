const Group = require('../model/group');
const UserGroup = require('../model/usergroup');

exports.addGroup = async(req, res, next)=>{
    try{
        // console.log(req.body);
        const {groupName} = req.body;

        // validate...
        if(!groupName){
            return res.status(400).json({err: 'enter all fields'})
        }

        // find if group already exists...
        const existingGroup = await Group.findOne({where: {groupName}});

        if(existingGroup){
            return res.status(400).json({err: 'group already exists'});
        }

        const creategroups = await Group.create({groupName});
        // console.log('creategroups>>>>', creategroups);
        const usergroup = await UserGroup.create({groupname: creategroups.groupName, name: req.user.name, isAdmine: true, groupId: creategroups.id, userId: req.user.id})

        res.status(201).json({newGroups: creategroups, success: true});
    } catch(err){
        console.log('add group failed>>>>', err);
        res.status(500).json({err: err});
    }
}

exports.getGroup = async(req, res, next)=>{
    try{
        const allGroups = await UserGroup.findAll({
            where: {userId: req.user.id},
            attributes: ['groupname','userId'],
        });
        // console.log(allGroups)
        res.status(200).json(allGroups);
    } catch(err){
        console.log('get groups failed>>>>',err);
        res.status(500).json({err: err});
    }
};
 