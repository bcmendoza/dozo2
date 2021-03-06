
const mongoose = require('mongoose');
const Project = mongoose.model('Project');
const User = mongoose.model('User');
const Lane = mongoose.model('Lane');

function sendMsg(status, msg){
    return {
        status: status,
        msg: msg
    }
}

module.exports = {
    
    list(req, res){
        Project.find({type:'Team', contributor_ids:{$nin:[req.session.uid]}})
        .then(projects => res.json(projects));
    },
    
    getUserProjects(req, res){
        User.findById(req.session.uid, {project_ids:1})
        .populate('projects')
        .then(projects => res.json(projects));
    },

    create(req, res){
        User.findById(req.session.uid)
        .then(user => {
            const project = new Project(req.body);
            user.project_ids.push(project._id);
            project.creator = user._id;
            const lane = new Lane({title: "To Do"});
            project.grid_ids = [lane._id];
            user.save()
            .then(user => {
                project.save()
                .then(project => {
                    lane.save()
                    .then(lane => {
                        res.json(sendMsg(true, `"${project.title}" created.`));
                    })
                    .catch(err => console.log(err));
                })
            })
        })
    },

    updateUserProjects(req, res){
        User.findById(req.session.uid)
        .then(user => {
            user.project_ids = req.body;
            user.save()
            .then(user => {
                res.json(sendMsg(true, `Saving changes...`));
            })
        })
    },
    
    lookup(req, res){
        Project.findById(req.params.id)
        .populate({path: 'creator', select: ['first', 'last', 'name', '_id'] })
        .populate({ path: 'contributors', select: ['first', 'last', 'name', '_id'] })
        .populate({ path: 'grid',
            populate: { path: 'tasks',
                populate: [
                    { path: 'creator', select: ['first', 'last', 'name', '_id'] },
                    { path: 'contributor', select: ['first', 'last', 'name', '_id'] }
                ]
            }
        })
        .then(project => {
            req.session.pid = project._id;
            res.json(project);
        })
        .catch(err => res.json(false));
    },

    filter(req, res){
        Project.findById(req.params.id)
        .populate({path: 'creator', select: ['first', 'last', 'name', '_id'] })
        .populate({ path: 'contributors', select: ['first', 'last', 'name', '_id'], })
        .populate({ path: 'grid',
            populate: { path: 'tasks', match: { contributor: req.session.uid },
                populate: [
                    { path: 'creator', select: ['first', 'last', 'name', '_id'] },
                    { path: 'contributor', select: ['first', 'last', 'name', '_id'] }
                ]
            }
        })
        .then(project => {
            req.session.pid = project._id;
            res.json(project);
        })
        .catch(err => res.json(false));
    },

    getAgenda(req, res){
        User.findById(req.session.uid)
        .then(user => {
            Project.findById(user.agenda)
            .populate({path: 'creator', select: ['first', 'last', 'name', '_id'] })
            .populate({ path: 'contributors', select: ['first', 'last', 'name', '_id'] })
            .populate({ path: 'grid',
                populate: { path: 'tasks',
                    populate: [
                        { path: 'creator', select: ['first', 'last', 'name', '_id'] },
                        { path: 'contributor', select: ['first', 'last', 'name', '_id'] }
                    ]
                }
            })
            .then(agenda => {
                req.session.pid = agenda._id;
                res.json(agenda);
            })
            .catch(err => res.json(false));
        });
    },

    update(req, res){
        Project.findByIdAndUpdate(req.params.id, req.body,
            {runValidators:true, new:true, context: 'query'})
        .then(project => {
            res.json(sendMsg(true, `"${project.title}" updated.`));
        })
    },

    join(req, res){
        Project.findById(req.params.id)
        .then(project => {
            project.contributor_ids.push(req.session.uid);
            project.save()
            .then(project => {
                User.findById(req.session.uid)
                .then(user => {
                    user.project_ids.push(project._id);
                    user.save()
                    .then(user => res.json(sendMsg(true, `"${project.title}" added to your list!`)))
                })
            })
        })
    },

    // delete project
    remove(req, res){
        Project.findByIdAndRemove(req.params.id)
        .then(project => {
            res.json(sendMsg(true, `Project "${project.title}" deleted.`));
        })
    },
    
}