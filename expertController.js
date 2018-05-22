const   mongoose = require('mongoose'),
        Questions = require('./questionData'),
        parser = require('json-parser'),
        http = require('http');
        options = {
            server: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } },
            replset: { socketOptions: { keepAlive: 1, connectTimeoutMS: 30000 } }
        };


module.exports={

    allQuestion(){
        return Questions.find();
    }, 

    createQuestion(req,response){
        let newQuestion = new question({
            questionId: req.body.questionId,
            questionData: req.body.questionData,
            Wchemistry: req.body.Wchemistry,
            Wsoftware: req.body.Wsoftware,
            Welectronic:req.body.Welectronic,
            Wmedical:req.body.Wmedical, 
            Wmanagement:req.body.Wmanagement,
            Wbuilding:req.body.Wbuilding,
            Wmachine:req.body.Wmachine,
            }),
            answerUser='data saved';


        newQuestion.save(
            (err) => {
                if (err){
                    console.log('creat question');
                    answerUser='error';                        
                }

               else
                   console.log('question saved');
            });

        response.json(answerUser);

    },

    updateQuestion(req,response){
        Questions.findOneAndUpdate({questionId: req.body.questionId},
            {$set: {questionData:req.body.questionData,
                    Wchemistry: req.body.Wchemistry,
                    Wsoftware: req.body.Wsoftware,
                    Welectronic:req.body.Welectronic ,
                    Wmedical:req.body.Wmedical, 
                    Wmanagement:req.body.Wmanagement ,
                    Wbuilding:req.body.Wbuilding,
                    Wmachine:req.body.Wmachine}
            },
         (err,result)=>{
            if(err){
                console.log ('error');
            }

            else  {
                console.log(`succses`);
                return response.status(200).json("data update");
            }

        });
    },

    deleteQuestion(req,response){
        Questions.remove({questionId: req.body.questionId},
            (err,result)=>{
                if(err){
                    console.log ('error');
                }

                else  {
                    console.log(`succses`);
                    return response.status(200).json("question deleted");
                }
            });
    }


};
