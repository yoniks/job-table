 const express = require('express');
  const app = express();
 //const bodyParser=require("body-parser");
 var bodyParser = require('body-parser');
 const _=require('lodash');
 const {render} = require("ejs");
 const mongoose = require('mongoose');
const { isElement } = require('lodash');


  const port=3000;

 app.use(express.static("public"));
 app.use(bodyParser.urlencoded({extended:true}));
 // parse an HTML body into a string
app.use(bodyParser.text({ type: 'text/html' }))
 // parse application/json
 app.use(bodyParser.json())

 app.set('view engine','ejs');
 var existPrjs=[];
 let isOpenedPrj=0;




  main().catch(err => console.log(err));
  async function main() {
      await mongoose.connect('mongodb://localhost:27017/simpletask');
  }

      const table_0 = new mongoose.Schema({idTable: Number, rows: Number, cols: Number});
      const objTask_0 = {isSelected: Boolean, text: String};
      const taskList_0 = new mongoose.Schema({ idTable: Number, taskList:[objTask_0]});

      const Table = mongoose.model('Table', table_0);
      const List = mongoose.model('List', taskList_0);


    


  
   


   const taskCreated =(req, res)=> {
    
          let newRow = Number(Math.round(req.body.idRow));
          let newColm = Number(Math.round(req.body.idColumn));
        
           let  mIdTable = Number(Math.round(req.body.idTaskCreated));
           
         
          console.log("new size table " + (newRow * newColm) + " id: " + mIdTable);

          if (newColm === 0 || newRow === 0 || newColm > 4) {//limit until 5 column
            res.render("tasks", { idTask: 0, percents: 0, rows: 0, columns: 0, ListTask: [],idExistPrjs:[]});
          }
          

          Table.findOne({idTable: mIdTable}, function (err, rowAndCol) {
      
              if (!err) {
                  if (!rowAndCol) {//rowAndCol.$isEmpty('idTable')
                    
                
                      const mTable = new Table({idTable: mIdTable, rows: newRow, cols: newColm});
                      mTable.save().then(j => {// if success
                      
                          if (j === mTable) {
                              let objT = {isSelected: false, text:'l'};
                              let mTaskList = [];
                              for (let i = 0; i < (newRow * newColm); i++) {
                                  mTaskList.push(objT);
                              }
                              const doc = new List({idTable: mIdTable, taskList: mTaskList});
                              doc.save().then(d => {
                                  if (doc === d) {
                                    isOpenedPrj=mIdTable;
                                      res.redirect("/");
                                  }
                              });
                          }
                      }).catch(e=>{
                          console.log(" err: "+e);
                          throw e;
                        
                      });// then

                  }else{
                    res.render("tasks", { idTask: 0, percents: 0, rows: 0, columns: 0, ListTask: [],idExistPrjs:[]});
                  } 
                  
            
              }else{
                  console.log("error");
                
              }  

          })// close fun findOne
    };// post


 

const taskEdit=(req,res) => {


  // let id=req.body.idTaskEdit;
  console.log("taskEdit: "+req.params.id_prj);

    let dFlag=true;
   let newRow = Number(Math.round(req.body.idRow));
   let newColm = Number(Math.round(req.body.idColumn));
    let  idTaskPrj = Number(req.params.id_prj);  // Math.round(req.body.idTaskCreated));
    let  temp = Number(req.body.idTaskCreated);
    if(idTaskPrj!=temp){
        res.redirect("/");
        dFlag=false;
    }else{
   
    let foundList;
    let row_col=newRow*newColm;
    console.log("edit "+row_col+" ,  "+idTaskPrj+ " "+temp);
   

    List.findOne({idTable:idTaskPrj}, function(err, foundLists) {
 if(!err){
              if(!foundLists){
              console.log("not found");
              dFlag=false;
              }else if((row_col) == (foundLists.taskList.length)){
               dFlag=false;

              }else if(foundLists!==null){
               console.log("it not empty");
               foundList=foundLists;
               console.log((row_col)+" != "+foundList.taskList.length);
              }

    if(dFlag){
        isOpenedPrj=idTaskPrj;// to return this table/prj at "/"

             if ((row_col)  > foundList.taskList.length) {
                console.log("1 "+foundList.taskList.length);
              let resultToAdd = ((row_col) - (foundList.taskList.length));
            console.log("add to tasks: " + resultToAdd + " ");
            var mList=[];
            let objs={isSelected: false, text:'l'};
               for(let i=0;i<resultToAdd;i++){
                mList.push(objs);
               }
           
             
            List.findOneAndUpdate({idTable:foundList.idTable}, {$push:{taskList: mList}}, {multi:true},function (err) {
                  if (!err) {                                                                
                          console.log("edit id: "+foundList.idTable);
                         Table.findOneAndUpdate({idTable:foundList.idTable}, {$set: {rows: newRow, cols: newColm}}, function (err) {
             
                             if (!err) {
                                 console.log("secsseful change! ");
                                 res.redirect("/");
                             }
                         });                                
                  }
              });

              

        
         }else  if((row_col)<foundList.taskList.length) {
            isOpenedPrj=idTaskPrj;
            
            let lastIndexSelected = 0;
            let indexInputNotEmpty = 0;
            
            foundList.taskList.forEach(function (indexTask) {
                indexInputNotEmpty += 1;
                if (indexTask.isSelected) {
                    lastIndexSelected = indexInputNotEmpty;
                }
               
             })
             console.log("= "+lastIndexSelected);
            if (row_col < lastIndexSelected&&lastIndexSelected>0) {
               row_col=  lastIndexSelected; 
            }
           console.log("2");

            //let resultToDelete = (foundList.taskList.length) - (row_col) + flag;
            console.log("deleted  tasks: " + row_col+ " index"+" at "+foundList._id+" "+foundList.taskList.length+" "+foundList.idTable);
      
            let toDelete = [];
           
              //await List.findOne({idTable: mIdTable}, function (err, foundList) {
              for (let i = row_col; i < (foundList.taskList.length); i++) {
                  toDelete.push(foundList.taskList[i]._id);
               // console.log(JSON.stringify( foundList.taskList[i]._id.toString()));
             
              }
            
    
          List.findOneAndUpdate({_id:foundList._id}, {$pull: {taskList: {_id:{$in:toDelete } }}}, {multi: true}, function (err, deleteList) {
                 console.log(err);
                      if (!err) {
                      console.log("successful delete  "+deleteList._id);
                
             Table.findOneAndUpdate({idTable:deleteList.idTable}, {$set: {rows: newRow, cols: newColm}}, function (err) {
                     if (!err) {
                        res.redirect("/");
                   }
              }); 
             }//err
         });// List.findOneAndUpdate

        }//else if



    }else{// if 140
     res.redirect("/");
    }

    }//err 127
});  // findone 126




    }//else 117
};// close










   const SelectedTask= (req,res)=>{
          let resultSelected;
          let idPrj=0;
          let toRef;
          console.log("SelectedTask "+req.params.toValue+" + "+req.params.id_prj+" "+!_.isEmpty(req.params.id_prj)+" "+!_.isEmpty(req.params.toValue));
         
         if(!_.isEmpty(req.params.toValue) && !_.isEmpty(req.params.id_prj)){
            toRef=req.params.toValue;
            idPrj=Number(req.params.id_prj);
             // idObj=_.capitalize(req.params.idselect);
              console.log("id ==>  "+idPrj+" "+toRef);
          }else{
              res.send("");
              console.log("empty");
            //res.redirect("/");
          }
          List.findOne({idTable: idPrj}, function (err, foundList) {
                
            if(!err){
                if(!foundList){
                res.redirect("/");
                }else{
           //   isOpenedPrj=idPrj;
              foundList.taskList.forEach(function (task) {
                  console.log(typeof task._id);
                  if (task._id == toRef) {
                      resultSelected = task.isSelected;
                     // console.log("isSelected"+(!(resultSelected)));
                  }
              });
           
              List.findOneAndUpdate({_id:foundList._id},
                {$set: {"taskList.$[elem].isSelected":(!(resultSelected))}}, 
                {arrayFilters: [{"elem._id": toRef}]},function(err){

                    if(!err){
                        isOpenedPrj=idPrj;
                        console.log("***"+isOpenedPrj);
                        res.redirect("/");
                    }else{
                        throw err;
                    }
                });
             
                }//else
              }else{
                res.redirect("/");
              }
          })};








  const getProjectTask=(req,res)=>{

     console.log("getProjectTask");
     let idProjects=0;
     let CurrentPercent=0;
     let numIndexSelected=0;
      let mCol=0 , mRow=0 ;
     //  idProjects=_.lowerCase(req.params.idprj);
     if(_.isEmpty(req.params.id_prj)){
       res.redirect("/");
     }else{
        idProjects=Number(req.params.id_prj);// get the id prj of isOpenedPrj or just the first one 
    
     console.log(req.params.id_prj+ " , "+idProjects);
     
     Table.findOne({idTable:idProjects}, function (err, cr) {
         if (!err) {
             if (!cr) {
                    res.render("tasks", { idTask: 0, percents: 0, rows: 0, columns: 0, ListTask: [],idExistPrjs:[]});//get ref from server
             } else {
                 console.log(" " + cr.cols + " - " + cr.rows);
                 mCol = cr.cols;
                 mRow = cr.rows;

                 List.findOne({idTable:idProjects}, function (err, foundList) {
                     if (!err) {
                         if (!foundList) {
                             console.log("there is no task to display");
                         } else {
                             console.log("id : " + foundList._id);
                             foundList.taskList.forEach(function (task) {
                                 if (task.isSelected) {
                                    numIndexSelected += 1;
                                    console.log("true: "+task._id);
                                
                                 } 
                             })

                             if (numIndexSelected > 0) {// the process of work
                                 CurrentPercent = ((numIndexSelected) / (mRow * mCol));
                                 CurrentPercent *= 100;
                                 CurrentPercent = CurrentPercent.toFixed(2);
                                 console.log("percent: "+CurrentPercent);
                             } else {
                                 CurrentPercent = 0;
                             }
                             console.log("=> "+foundList.idTable);
                        
                             res.render("tasks", {
                                 idTask:foundList.idTable, percents:CurrentPercent, rows: mRow, columns: mCol,
                                 ListTask: foundList.taskList,idExistPrjs: existPrjs });//get ref from server
                         }
                     }
                 })//  list.findOne
               }// else table

         } else {// err bring data table
             console.log("err");
             res.render("tasks", { idTask: 0, percents: 0, rows: 0, columns: 0, ListTask: [] ,idExistPrjs:[]});
         }
     })//Table.findOne

    }//else 305
  };


  const getAllId=(req,res)=>{
    console.log("get");
    //for example:  if user login at seccessful than dow all thier prjs   
    Table.find({},function(err,foundList){
        if(!err){
            console.log("== "+foundList);
            if(foundList.length>0){// return list
                  let temp=foundList[0].idTable
                  existPrjs=[];
                foundList.forEach(function(d){
                    console.log( `${d.idTable}===${isOpenedPrj}`)
                   if(d.idTable===isOpenedPrj){// if we uadate than just return to right project
                       temp=d.idTable;
                       console.log("op  "+typeof d.idTable);
                   }

                   console.log(""+typeof d.idTable+" "+typeof isOpenedPrj);
                    existPrjs.push(d.idTable);
                });
             console.log("s "+temp+" - "+existPrjs);
                res.redirect("/task/"+temp);
            }else{
                console.log("else ");
               // res.redirect("/task/"+mIdPrj);
                res.render("tasks", { idTask: 0, percents: 0, rows: 0, columns: 0, ListTask: [] ,idExistPrjs:[]});
            }
           
    
        }else{
          res.send(err);
        }
    });
    
    }

    const deleteTaskObj=(req,res)=>{
         let temp= Number(req.body.deleteTaskbyId); 
        let id_Table= Number(req.params.id_prj);//get the id  of  app.route("/").get(getAllId);
        console.log("id task deleted: "+id_Table+" "+temp);
          if(temp===id_Table){// just if you want delete the table that display
            Table.deleteOne({idTable:id_Table }, function(err){
      
    
     if(!err){
        List.deleteOne( {idTable:id_Table},function(err){

            if(!err){
                isOpenedPrj=0;
            res.redirect("/");
            }

        } );
       
     }
  
    });

   }else{
       console.log("id not match");
       res.redirect("/");
   }
    
    };

    app.route("/").get(getAllId);

  app.route("/task/tc/TaskCreate").post(taskCreated);

      app.route("/task/:id_prj/TaskEdit").post(taskEdit);
      app.route("/task/:id_prj/DeleteTaskObj").post(deleteTaskObj);


      app.route("/task/:id_prj/:toValue").post(SelectedTask);
        


      app.route("/task/:id_prj").get(getProjectTask); 
    //  app.route("/task").get(getProjectTask);

    
      app.listen(process.env.PORT || port,function( ) {
        console.log(`listening`);
         });
