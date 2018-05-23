var mongoose = require('mongoose');
var scrapy = require('node-scrapy');
var dateFormat = require('dateformat');
var async = require('async');
var fs = require('fs');

// Schemes
var College = require('./collegeData');
var Department = require('./departmentData');

// Daily Get Colleges Data from external Url
exports.getCollegesData = function(req, res){
    console.log("Start Get All Colleges Data...");

    let collegesArr = [];
    var colleges = [
        {
            "id": "1019560",
            "name": "shankar-school-of-engineering",
            "url": "https://limudim.psychometry.co.il/shenkar/shenkar_requirements.php"
        },{
            "id": "34969730",
            "name": "afeka-engineering-college",
            "url": "https://limudim.psychometry.co.il/afeka/requirements_afeka.php"
        },{
            "id": "1179940",
            "name": "bar-ilan-university",
            "url": "http://engineering.biu.ac.il/about",
        },{
            "id": "966690",
            "name": "tau-university",
            "url": "https://limudim.psychometry.co.il/tau/application-chances.php"
        },{
            "id": "33314510",
            "name": "ariel-university-center",
            "url": "https://limudim.psychometry.co.il/ariel/ariel_requirements.php"
        },{
            "id": "3049800",
            "name": "hit-holon1",
            "url": "https://limudim.psychometry.co.il/hit/ba-electronics.php"
        },{
            "id": "39340070",
            "name": "ruppin-college-technology",
            "url": "https://limudim.psychometry.co.il/ruppin/rupin_requirements.php"
        },{
            "id": "10518040",
            "name": "college-ort-braude",
            "url": "https://limudim.psychometry.co.il/braude/brauda_requirements.php"
        },{
            "id": "8149700",
            "name": "college-kinneret",
            "url": "https://limudim.psychometry.co.il/kinneret/kineret_requirements.php"
        },{
            "id": "10690120",
            "name": "technion",
            "url": "https://limudim.psychometry.co.il/technion/application-chances.php"
        },{
            "id": "6002050",
            "name": "hebrew-university",
            "url": "https://limudim.psychometry.co.il/huji/application-chances.php"
        },{
            "id": "41324290",
            "name": "jerusalem-college-engineering",
            "url": "https://limudim.psychometry.co.il/jce/azrieli_requirements.php"
        },{
            "id": "2590930",
            "name": "ben-gurion-university",
            "url": "https://limudim.psychometry.co.il/bgu/application-chances.php"
        },{
            "id": "40509770",
            "name": "engineering-college-shamoon",
            "url": "https://limudim.psychometry.co.il/sce/sami_shamun_requirements.php"
        }   
    ]

    async.waterfall([

        function(callback) { // Get Details

            console.log("Start: A - 1");
            console.log("getDetails START!");

            var startUrl = "http://www.ilimudim.co.il/i/";

            var collegeDetails = {
                name: '.si-hd-txt > h1',
                headline: '.si-hd-txt > h3',
                description: '#generalDiv > p',
                specialization: '.academic-links > ul > li'
            };

            var currCollege = 0;
            var collegesLen = colleges.length;

            for (var i = 0; i<collegesLen; i++) {

                let fullUrl = startUrl+colleges[i].name;

                let newCollege = new College();
                newCollege.engName = colleges[i].name;
                newCollege.reqUrl = colleges[i].url;
                newCollege.collegeId = colleges[i].id;
                
                scrapy.scrape(fullUrl, collegeDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log(currCollege+"/"+collegesLen);

                    // set college details
                    newCollege.specialization = data.specialization;
                    newCollege.description = data.description;
                    newCollege.headline = data.headline;
                    newCollege.hebName = data.name;

                    collegesArr[currCollege] = newCollege;

                    // console.log(currCollege+"/"+collegesLen+" FullUrl: "+fullUrl+JSON.stringify(data, null, 2));

                    if(currCollege==collegesLen-1) {
                        console.log("End: A - 1");
                        callback(null, "a11111");   
                    }
                    else currCollege++;
                });
            }
        },

        function(caption, callback) { // Get Address

            console.log("Start: B - 2");
            console.log("getAddress START!");

            var startUrl = "http://www.ilimudim.co.il/i/";

            var collegeDetails = {
                name: '.si-hd-txt > h1',
                info: '.search-plain tr > td'
            };

            var currCollege = 0;
            var collegesLen = colleges.length;

            for (var i = 0; i<collegesLen; i++) {

                let fullUrl = startUrl+colleges[i].name+"#dorms";
                
                scrapy.scrape(fullUrl, collegeDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log(currCollege+"/"+collegesLen);

                    // set college details
                    for (var i = 0; i < collegesArr.length; i++) {
                        if(collegesArr[i].hebName == data.name){
                            // console.log("Match: "+currCollege);
                            collegesArr[i].address = data.info[5];
                            collegesArr[i].tuitionFee = data.info[1];
                            collegesArr[i].dorms = data.info[3];
                        }
                    }

                    // console.log(currCollege+"/"+collegesLen+" FullUrl: "+fullUrl+JSON.stringify(data, null, 2));

                    if(currCollege==collegesLen-1) {
                        console.log("End: B - 2");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                });
            }
        },

        function(caption, callback) { // Get Phone

            console.log("Start: C - 3");
            console.log("getPhone START!");

            var startUrl = "https://www.d.co.il/";

            var collegeDetails = {
                tel: '.phone-number-txt',
                link: 
                    { selector: 'link',
                      get: 'href',
                      prefix: '' }
            };

            var currCollege = 0;
            var collegesLen = colleges.length;

            for (var i = 0; i<collegesLen; i++) {

                let fullUrl = startUrl+colleges[i].id+"/8200/";
                
                scrapy.scrape(fullUrl, collegeDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }

                    let collegeId = data.link[1].split("https://www.d.co.il/").join("").split("/8200/").join("").split("/8190/").join("");

                    // set college details
                    for (var j = 0; j < collegesArr.length; j++) {
                        if(collegesArr[j].collegeId == collegeId){
                            // console.log("Match: "+collegeId);
                            collegesArr[j].tel = data.tel;
                        }
                    }

                    // console.log(currCollege+"/"+collegesLen+" "+JSON.stringify(data, null, 2));

                    if(currCollege==collegesLen-1) {
                        console.log("End: C - 3");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                });
            }
        },

        function(caption, callback) { // Get Open Days

            console.log("Start: D - 4");
            console.log("getOpenDays START!");

            var collegesLinks = [
                {
                    "id": "1019560",
                    "name": "shankar-school-of-engineering",
                    "url": "https://handesaim.shenkar.ac.il/"
                },{
                    "id": "34969730",
                    "name": "afeka-engineering-college",
                    "url": "https://www.afeka.ac.il/about-afeka/engineering-channel-information/open-day-afeka/"
                },{
                    "id": "1179940",
                    "name": "bar-ilan-university",
                    "url": "http://engineering.biu.ac.il/node/9060",
                },{
                    "id": "966690",
                    "name": "tau-university",
                    "url": "http://go.tau.org.il/campaigns/0518_openday/minisite/?BannID=8084&gclid=Cj0KCQjw0PTXBRCGARIsAKNYfG35Hy7iRB66oa3OMKh1AmoU8hOS-dOP68m4Zi_XzIKVf351lrCmRYMaAoz1EALw_wcB"
                },{
                    "id": "33314510",
                    "name": "ariel-university-center",
                    "url": "https://www.ariel.ac.il/university/newsite/openday.asp"
                },{
                    "id": "3049800",
                    "name": "hit-holon1",
                    "url": "http://www.hit.ac.il/sites/candidates/Campus/info-sessions"
                },{
                    "id": "39340070",
                    "name": "ruppin-college-technology",
                    "url": "https://www.michlalot.co.il/ruppin/open.php"
                },{
                    "id": "10518040",
                    "name": "college-ort-braude",
                    "url": "https://www.braude.ac.il/Campaign/?ref=google&type=1&gclid=Cj0KCQjw0PTXBRCGARIsAKNYfG0HuxPKWpxV6F_wsdrD2aSs76QW1NB9tVALuwb5g1H7wR1nnQ4b180aAv2JEALw_wcB"
                },{
                    "id": "8149700",
                    "name": "college-kinneret",
                    "url": "https://www.michlalot.co.il/kinneret/open.php"
                },{
                    "id": "10690120",
                    "name": "technion",
                    "url": "https://www.michlalot.co.il/pet/main.php"
                },{
                    "id": "6002050",
                    "name": "hebrew-university",
                    "url": "https://new.huji.ac.il/event/33402"
                },{
                    "id": "41324290",
                    "name": "jerusalem-college-engineering",
                    "url": "https://www.jce.ac.il/search/%D7%99%D7%95%D7%9D+%D7%A4%D7%AA%D7%95%D7%97"
                },{
                    "id": "2590930",
                    "name": "ben-gurion-university",
                    "url": "http://in.bgu.ac.il/welcome/pages/events/BGU-openday-2018.aspx"
                },{
                    "id": "40509770",
                    "name": "engineering-college-shamoon",
                    "url": "http://www.sce-ac.co.il/?lm_key=de505052e6314ad1935a419ac41fffa0&lm_form=11055&lm_supplier=1196&utm_source=g&utm_campaign=964035723&utm_medium=c&utm_content=%2B%D7%A1%D7%9E%D7%99%20%2B%D7%A9%D7%9E%D7%A2%D7%95%D7%9F%20%2B%D7%99%D7%95%D7%9D%20%2B%D7%A4%D7%AA%D7%95%D7%97&gclid=Cj0KCQjw0PTXBRCGARIsAKNYfG0he0Ysmj1px9NJml-XCyHo2tbx1IEUjHeZGppWmsucE-KwCLB4-YAaAsvjEALw_wcB"
                }   
            ]

            var currCollege = 0;
            var collegesLen = collegesLinks.length;

            var shenkarDetails = {openday: '.floating-text > div > span'};
            var afekaDetails = {openday: '.articleBox > h3'};
            var barIlanDetails = {openday: 'h1'};
            var tauDetails = {openday: 'h1 > span'};
            var arielDetails = {openday: '.pnimi_text > strong'};
            var hitDetails = {openday: '.hit-align-center strong'};
            var ruppinDetails = {openday: '.page-content-wrapper-anchors-item-content > div'};
            var ortDetails = {openday: '.data-box div'};
            var kinneretDetails = {openday: '.page-content-wrapper-anchors-item-content > div > p'};
            var technionDetails = {openday: '.page-content-wrapper-anchors-item-content > div > p'};
            var hujiDetails = {openday: '.field-name-body > .field-items > .field-item > div'};
            var azrieliDetails = {openday: 'h2.entry-title'};
            var bguDetails = {openday: 'h1'};
            var sceDetails = {openday: '.marked-header > h2'};

            for (var i = 0; i<collegesLen; i++) {

                if(collegesLinks[i].name == "shankar-school-of-engineering"){
                    scrapy.scrape(collegesLinks[i].url, shenkarDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "shankar-school-of-engineering");
                    });
                }
                if(collegesLinks[i].name == "afeka-engineering-college"){
                    scrapy.scrape(collegesLinks[i].url, afekaDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "afeka-engineering-college");
                    });
                }
                if(collegesLinks[i].name == "bar-ilan-university"){
                    scrapy.scrape(collegesLinks[i].url, barIlanDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "bar-ilan-university");
                    });
                }
                if(collegesLinks[i].name == "tau-university"){
                    scrapy.scrape(collegesLinks[i].url, tauDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "tau-university");
                    });
                }
                if(collegesLinks[i].name == "ariel-university-center"){
                    scrapy.scrape(collegesLinks[i].url, arielDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "ariel-university-center");
                    });
                }
                if(collegesLinks[i].name == "hit-holon1"){
                    scrapy.scrape(collegesLinks[i].url, hitDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "hit-holon1");
                    });
                }
                if(collegesLinks[i].name == "ruppin-college-technology"){
                    scrapy.scrape(collegesLinks[i].url, ruppinDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday, "ruppin-college-technology");
                    });
                }
                if(collegesLinks[i].name == "college-ort-braude"){
                    scrapy.scrape(collegesLinks[i].url, ortDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "college-ort-braude");
                    });
                }
                if(collegesLinks[i].name == "college-kinneret"){
                    scrapy.scrape(collegesLinks[i].url, kinneretDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "college-kinneret");
                    });
                }
                if(collegesLinks[i].name == "technion"){
                    scrapy.scrape(collegesLinks[i].url, technionDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "technion");
                    });
                }
                if(collegesLinks[i].name == "hebrew-university"){
                    scrapy.scrape(collegesLinks[i].url, hujiDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "hebrew-university");
                    });
                }
                if(collegesLinks[i].name == "jerusalem-college-engineering"){
                    scrapy.scrape(collegesLinks[i].url, azrieliDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[1], "jerusalem-college-engineering");
                    });
                }
                if(collegesLinks[i].name == "ben-gurion-university"){
                    scrapy.scrape(collegesLinks[i].url, bguDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "ben-gurion-university");
                    });
                }
                if(collegesLinks[i].name == "engineering-college-shamoon"){
                    scrapy.scrape(collegesLinks[i].url, sceDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                            currCollege++;
                        }
                        else return saveOpenDay(data.openday[0], "engineering-college-shamoon");
                    });
                }
            }

            function saveOpenDay(openday, collegeName){
                if(openday){
                    // set college details
                    for (var j = 0; j < collegesArr.length; j++) {
                        if(collegesArr[j].engName == collegeName){
                            // console.log(collegeName+" Match!");
                            collegesArr[j].openday = openday;
                        }
                    }
                    // console.log(collegeName+": "+openday);
                    if(currCollege==collegesLen-1) {
                        console.log("End: D - 4");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                }
                else {
                    // set college details
                    for (var j = 0; j < collegesArr.length; j++) {
                        if(collegesArr[j].engName == collegeName){
                            // console.log(collegeName+" Match!");
                            collegesArr[j].openday = "לא ידוע";
                        }
                    }
                    // console.log(collegeName+": unknown");
                    if(currCollege==collegesLen-1) {
                        console.log("End: D - 4");
                        callback(null, "a33333");   
                    }
                    else currCollege++;
                }
            }
        },

        function(caption, callback) { // Get Requirements

            console.log("Start: E - 5");
            console.log("getRequirements START!");

            var collegeDetails = {
                requirements: 'div#customers-page-contents',
                href: 
                    { selector: '.text-left > a',
                      get: 'href',
                      prefix: '' }
            };

            var collegeDetails2 = {
                requirements: '.rtejustify'
            };


            var currCollege = 0;
            var collegesLen = collegesArr.length;

            for (var i = 0; i<collegesLen; i++) {
                if(colleges[i].url.includes("limudim.psychometry.co.il/")){
                    scrapy.scrape(colleges[i].url, collegeDetails, function(err, data) {
                        if (err) {
                            console.error(err);
                        }

                        // set college details
                        for (var j = 0; j < collegesLen; j++) {

                            let tmpUrl = collegesArr[j].reqUrl.split("/", 4).join("/");

                            if(data.href.substring(0, data.href.length-9)==tmpUrl) {
                                collegesArr[j].requirements = data.requirements;
                            }
                        }

                        // console.log(currCollege+"/"+collegesLen+"  "+JSON.stringify(data, null, 2));

                        if(currCollege==collegesLen-1) {
                            console.log("End: E - 5");
                            callback(null, "a33333");   
                        }
                        else currCollege++;
                    });
                }
                else {

                    scrapy.scrape(colleges[i].url, collegeDetails2, function(err, data) {
                        if (err) {
                            console.error(err);
                        }

                        // set college details
                        for (var j = 0; j < collegesLen; j++) {
                            if(collegesArr[j].engName=="bar-ilan-university") {
                                collegesArr[j].requirements = data.requirements[2];
                                // console.log("KINGGGGGG : "+data.requirements[2]);
                            }
                        }

                        // console.log(currCollege+"/"+collegesLen+" TAU "+JSON.stringify(data, null, 2));

                        if(currCollege==collegesLen-1) {
                            console.log("End: E - 5");
                            callback(null, "a33333");   
                        }
                        else currCollege++;
                    });
                }
            }
        },

    ],  
    function (err) {
        console.log("Save Json START!");
        var json = JSON.stringify(collegesArr, null, 2);
        // console.log(json);
        saveColleges(collegesArr);
        fs.writeFile('colleges.json', json, 'utf8', function(){            
            console.log("Save Json is finished!");
        });
        // return res.json(collegesArr);
    });
    

    function saveColleges(collegesArr) {
        console.log("Start saveColleges...")
        for (var i = 0; i < collegesArr.length; i++) {

            // College.create(collegesArr[i], function(err, newCollege){
            //     console.log("College "+newCollege+" saved successfully !");
            // })

            College.update().
            where('engName').equals(collegesArr[i].engName).
            exec (function(err, newCollege){
                console.log("College "+newCollege+" saved successfully !");
            })
        }
    }
};

// Daily Get Colleges Data from external Url
exports.getDepartmentsData = function(req, res){
    console.log("Start Get All Departments Data...");

    let departmentsArr = [];
    var departments = [
        {
            "id": "1019560",
            "name": "management-industry",
            "url": "https://limudim.psychometry.co.il/ba/management-industry.php"
        },{
            "id": "34969730",
            "name": "mechanics",
            "url": "https://limudim.psychometry.co.il/ba/mechanics.php"
        },{
            "id": "1179940",
            "name": "software",
            "url": "https://limudim.psychometry.co.il/ba/software-engineering.php",
        },{
            "id": "966690",
            "name": "medicine",
            "url": "https://limudim.psychometry.co.il/ba/medicine.php"
        },{
            "id": "33314510",
            "name": "civil",
            "url": "https://limudim.psychometry.co.il/ba/civil-engineering.php"
        },{
            "id": "3049800",
            "name": "chemical",
            "url": "https://limudim.psychometry.co.il/ba/chemical-engineering.php"
        },{
            "id": "39340070",
            "name": "electronics",
            "url": "https://limudim.psychometry.co.il/ba/%D7%94%D7%A0%D7%93%D7%A1%D7%AA-%D7%90%D7%9C%D7%A7%D7%98%D7%A8%D7%95%D7%A0%D7%99%D7%A7%D7%94"
        }   
    ]

    async.waterfall([

        function(callback) { // Get Details

            console.log("Start: A - 1");
            console.log("getDetails START!");

            var departmentDetails = {
                name: '.page-content-title > h1',
                description: '#article-wrapper-data > .item'
            };

            var currDepartment = 0;

            for (var i = 0; i<departments.length; i++) {

                let newDepartment = new Department();
                newDepartment.engName = departments[i].name;

                scrapy.scrape(departments[i].url, departmentDetails, function(err, data) {
                    if (err) {
                        console.error(err);
                    }
                    // console.log(currDepartment+" => "+JSON.stringify(data, null, 2));

                    // set college details
                    newDepartment.hebName = data.name[0].split("תואר ראשון ב").join("");
                    newDepartment.description = data.description[0];

                    // set requirements offset by department
                    let requireOffset = 7;
                    if((newDepartment.hebName=="הנדסת אלקטרוניקה")||(newDepartment.hebName=="הנדסה כימית")) requireOffset = 5;
                    else if(newDepartment.hebName=="הנדסה רפואית") requireOffset = 6;   
                    newDepartment.requirements = data.description[requireOffset];

                    // set requirements offset by subjects
                    let subjectOffset = 3;
                    if(newDepartment.hebName=="הנדסת אלקטרוניקה") subjectOffset = 2;    
                    newDepartment.subjects = data.description[subjectOffset];

                    departmentsArr[currDepartment] = newDepartment;

                    if(currDepartment==departments.length-1) {
                        console.log("End: A - 1");
                        callback(null, "a11111");   
                    }
                    else currDepartment++;
                });
            }
        },

        function(caption, callback) { // Get Salary

            console.log("Start: B - 2");
            console.log("getSalary START!");

            var salaryUrl = "https://www.universities-colleges.org.il/%D7%A9%D7%9B%D7%A8-%D7%9E%D7%94%D7%A0%D7%93%D7%A1%D7%99%D7%9D/";
            
            var salaryDetails = {
                td: '.MsoNormalTable td'
            };

            scrapy.scrape(salaryUrl, salaryDetails, function(err, data) {
                if (err) {
                    console.error(err);
                    callback(null, "a33333");
                }
                else {
                    // console.log(JSON.stringify(data, null, 2));

                    saveSalary(data.td[4].split("� �����").join(""), data.td[5].split("� �����").join(""), "software");
                    saveSalary(data.td[10].split("� �����").join(""), data.td[11].split("� �����").join(""), "management-industry");
                    saveSalary(data.td[16].split("� �����").join(""), data.td[17].split("� �����").join(""), "chemical");
                    saveSalary(data.td[25].split("� �����").join(""), data.td[26].split("� �����").join(""), "medicine");
                    saveSalary(data.td[28].split("� �����").join(""), data.td[29].split("� �����").join(""), "electronics");
                    saveSalary(data.td[37].split("� �����").join(""), data.td[38].split("� �����").join(""), "civil");
                    saveSalary(data.td[49].split("� �����").join(""), data.td[50].split("� �����").join(""), "mechanics");

                    console.log("End: B - 2");
                    callback(null, "a33333");   
                }
            });

            function saveSalary(lowSalary, highSalary, depName){
                if((lowSalary)&&(highSalary)){
                    // set department salary
                    for (var j = 0; j < departmentsArr.length; j++) {
                        if(departmentsArr[j].engName == depName){
                            // console.log(depName+" Match!");
                            departmentsArr[j].lowSalary = lowSalary;
                            departmentsArr[j].highSalary = highSalary;
                        }
                    }
                }
                else {
                    departmentsArr[j].lowSalary = "Unknown";
                    departmentsArr[j].highSalary = "Unknown";
                }
            }
        },

    ],  
    function (err) {
        console.log("Save Json START!");
        var json = JSON.stringify(departmentsArr, null, 2);
        // console.log(json);
        saveDepartments(departmentsArr);
        fs.writeFile('departments.json', json, 'utf8', function(){         
            console.log("Save Json is finished!");
        });
    });

    function saveDepartments(departmentsArr) {
        console.log("Start saveDepartments...")
        for (var i = 0; i < departmentsArr.length; i++) {

            // Department.create(departmentsArr[i], function(err, newDep){
            //     console.log("Department "+newDep+" saved successfully !");
            // })

            // Department.findOne().where('engName', departmentsArr[i].engName).
            // exec (function(err, newDepartment){
            //     if(err) console.log("Error: "+err);
            //     else console.log("Department "+newDepartment+" saved successfully !");
            // })

            Department.update().
            where('engName').equals(departmentsArr[i].engName).
            exec (function(err, newDepartment){
                if(err) console.log("Error: "+err);
                else console.log("Department "+newDepartment+" saved successfully !");
            })
        }
    }
};

exports.getAllColleges = function(req,res){
    return College.find();
}
exports.getAllDepartments = function(req,res){
    return Department.find();
}
