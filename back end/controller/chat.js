const Chat = require('../model/chat');
const User = require('../model/user');
const Group = require('../model/group');
const UserGroup = require('../model/usergroup');
const AWS = require('aws-sdk');

require('dotenv').config();


exports.uploadFile = async(req, res, next)=>{
    try{
        const file = req.files.file; // Assuming you're using a middleware like 'express-fileupload'
        const fileName = file.name;
        // configure the IAM user credentials and the bucket...
        const BUCKET_NAME = 'joshuachatapp';
        const IAM_USER_KEY = process.env.ACCESS_KEY;
        const IAM_USER_SECRET = process.env.SECRET_KEY;
        
        // configure AWS
        AWS.config.update({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET,
        });

        const s3 = new AWS.S3();

        const params = {
            Bucket: BUCKET_NAME,
            Key: fileName,
            Body: file.data,
            ACL: 'public-read',
        };

        s3.upload(params, (err, data) => {
            if (err) {
                console.log('Error uploading to S3:', err);
                return res.status(500).json({ error: 'Failed to upload the file.' });
            }

            console.log('File uploaded successfully:', data.Location);
            return res.status(200).json({ message: 'File uploaded successfully.', fileUrl: data.Location });
        });
    } catch(err){
        console.log('uploading files to s3 failed>>>>', err);
        res.status(500).json({err: err});
    }
}

exports.addUserToGroup = async(req, res, next)=>{
    try{
        // console.log('req.body>>>>', req.body);
        const {newUser, groupName} = req.body

        // validate...
        if(!newUser){
            return res.status(400).json({err: 'please enter all the fields'});
        }

        // find if the user is present in the database...
        const existingUser = await User.findOne({where:{name: newUser}});
        if(!existingUser){
            return res.status(404).json({response: 'user not found'})
        }
        // console.log('existingUser>>>>', existingUser);

        // find if the group is present in group table...
        const existingGroup = await Group.findOne({where: {groupName}});
        if(!existingGroup){
            return res.status(404).json({response: 'group not found'});
        }
        // console.log('existingGroup>>>>', existingGroup);

        // restrict from adding the same users multiple times to the same group...
        if(existingGroup.userId === existingUser.id){
            return res.status(400).json({err: 'user already exists in group'});
            
        }

        const addNewUsers = await UserGroup.create({groupname: groupName, name: existingUser.name, groupId: existingGroup.id, userId: existingUser.id});
        res.status(201).json(addNewUsers);

    } catch(err){
        console.log('addUserToGroup failed>>>>', err);
        res.status(500).json({err: err});
    }
}

exports.getUsersofGroup = async(req, res, next)=>{
    try{
        const { groupName } = req.query;
        console.log('groupName>>>>', groupName);

        // find the existing group from the query params...
        const existingGroup = await UserGroup.findOne({where: {groupName}});

        if(!existingGroup){
            return res.status(404).json({err: 'group not found'});
        }
        // console.log('existingGroup>>>>', existingGroup);
        const getallusersofgroup = await UserGroup.findAll({
            where: {groupId: existingGroup.groupId},
            attributes: ['name', 'groupId']
        });
        res.status(200).json(getallusersofgroup);
    } catch(err){
        console.log('getUsersofGroup>>>>', err);
        res.status(500).json({err: err});
    }
}

exports.makenewAdmin = async(req, res, next)=>{
    try{
        const {groupName} = req.query;
        // console.log('groupName>>>>', groupName);
        
        // console.log(req.body);
        const {makeNewAdmin} = req.body;

        // Find the current user's details
        const currentUserId = req.user.id;
        const currentUserDetails = await UserGroup.findOne({
            where: { userId: currentUserId, groupname: groupName }
        });
        console.log('currentUserDetails>>>>', currentUserDetails);

        // Check if the current user is an admin...
        if (!currentUserDetails || !currentUserDetails.isAdmine) {
            return res.status(403).json({ error: 'You are not authorized to make new admin.' });
        }

        // Find the new user is present in database...
        const newUserDetails = await User.findOne({
            where: { name: makeNewAdmin }
        });

        if (!newUserDetails) {
            return res.status(404).json({ error: 'New user not found.' });
        }

        // Update the new user's admin status
        await UserGroup.update(
            { isAdmine: true },
            { where: { userId: newUserDetails.id, groupname: groupName } }
        );

        res.status(200).json({ success: true });

    } catch(err){
        console.log('makenewAdmin is failing>>>>', err);
        res.status(500).json({ err: err });
    }
}

exports.addNewChat = async(req,res,next)=>{
    try{
        // console.log(req.body);
        // const {message, fileUrl} = req.body;
        const {message} = req.body;

        const {groupName} = req.query;
        // console.log('groupName>>>>',groupName);

        // find the groupId...
        const existingGroup = await UserGroup.findOne({where: {groupName}});
        // console.log('existingGroup>>>>', existingGroup.groupId);

        const addMessage = await Chat.create({message, name: req.user.name, userId: req.user.id, groupId: existingGroup.groupId});
        res.status(201).json({newMessage: addMessage});
    } catch(err){
        console.log('adding new messsages failed>>>>', err);
        res.status(201).json({message: 'message added'})
    }
}

exports.deleteUserFromGroup = async (req, res, next) => {
    try {
        const { groupName, userId } = req.query;

        // Check if the current user is the admin of the group
        const currentUserGroup = await UserGroup.findOne({
            where: { groupId: groupName, userId: req.user.id, isAdmine: true }
        });

        if (!currentUserGroup) {
            return res.status(403).json({ message: 'You do not have permission to perform this action.' });
        }

        // Delete the user from the group
        await UserGroup.destroy({
            where: { groupId: groupName, userId }
        });

        res.status(200).json({ message: 'User deleted from the group successfully.' });
    } catch (err) {
        console.log('deleteUserFromGroup failed>>>>', err);
        res.status(500).json({ err: err });
    }
};

exports.getAllChat = async (req, res, next)=>{
    try{
        const { groupName } = req.query;
        // console.log('groupName>>>>',groupName);

        // find the groupId...
        const existingGroup = await UserGroup.findOne({where: {groupName}});
        // console.log('existingGroup>>>>', existingGroup.groupId);

        const getChat = await Chat.findAll({
            where: {groupId: existingGroup.groupId}
        });
        // console.log('getChat >>>', getChat);
        res.status(200).json({allChats: getChat});
    } catch(err){
        console.log('get all chat failed >>>>>', err);
        res.status(500).json({err: err});
    }
}
 
 
 