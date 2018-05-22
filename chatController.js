const   mongoose = require('mongoose'),
        questions = require('./questionData'),
        subEngByUser = require('./subEngByUserData'),
        parser = require('json-parser'),
        http = require('http');

module.exports={

    allQuestion(){
        return questions.find();
    },

    getQuestionById(req,res){
        console.log(`getId()`);
        console.log(`req.params.idNum -> ${req.params.idNum}`);
        questions.findOne({
        questionId : req.params.idNum
    }, (err,result)=>{
        if(err || !result){
         //   console.log(`userName not exists -> ${err}`);
            return res.status(500).json(`{id not exists:${err}}`);
        }

        res.json(result.questionData);
    });

    },

    calculateSubEng(req,res){
        let userId = req.params.userID;
        let num=1;
        let softwareArr=req.params.softwareArr.split(','),
            chemistryArr=req.params.chemistryArr.split(','),
            electronicArr=req.params.electronicArr.split(','),
            medicalArr=req.params.medicalArr.split(','),
            managementArr=req.params.managementArr.split(','),
            buildingArr=req.params.buildingArr.split(','),
            machineArr=req.params.machineArr.split(','),
            totalSoftware=100,
            totalChemistry=100,
            totalElectronic=100,
            totalMedical=100,
            totalManagement=100,
            totalBuilding=100,
            totalMachine=100;
            var answersArr=req.params.answers.split(',');

        console.log(userId);
        console.log(answersArr);

        for (let j=0; j<answersArr.length; j++){
            totalSoftware=totalSoftware-(softwareArr[j]*answersArr[j]);
            totalChemistry=totalChemistry-(chemistryArr[j]*answersArr[j]);
            totalElectronic=totalElectronic-(electronicArr[j]*answersArr[j]);
            totalMedical=totalMedical-(medicalArr[j]*answersArr[j]);
            totalManagement=totalManagement-(managementArr[j]*answersArr[j]);
            totalBuilding=totalBuilding-(buildingArr[j]*answersArr[j]);
            totalMachine=totalMachine-(machineArr[j]*answersArr[j]);
        }
            let userSubEng = new subEngByUser({
            userID: userId,
            software: totalSoftware,
            chemistry: totalChemistry,
            electronic: totalElectronic,
            medical: totalMedical,
            management: totalManagement,
            building: totalBuilding,
            machine:totalMachine
            });

            userSubEng.save(
                (err) => {
                    if (err){
                        console.log('creat error');                      
                    }

                    else
                       console.log('user saved');
                            res.json([totalSoftware,totalChemistry,totalElectronic,totalMedical,totalManagement,totalBuilding,totalMachine]);
                    });

    }


};