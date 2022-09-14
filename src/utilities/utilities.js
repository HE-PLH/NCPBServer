const xlsxFile = require("read-excel-file/node");
const mammoth = require("mammoth");
var fs = require('fs');
var request = require('request');
var path = require('path');
const multer = require('multer');
const db = require("../database/database");
const Schema = db.mongoose.Schema;
const Model = db.mongoose.model;


const readFile = function (src) {
    xlsxFile(src, {sheet: 1}).then((rows) => {
        for (let i in rows) {
            if (rows.hasOwnProperty(i)) {
                for (let j in rows[i]) {
                    if (rows[i].hasOwnProperty(j)) {
                        console.log(rows[i][j]);
                    }
                }
            }
        }
    });
};

const readDocFile = function (src) {
    mammoth.extractRawText({path: src})
        .then(function (result) {
            var text = result.value; // The raw text
            console.log(text);
            var messages = result.messages;
        })
        .done();
};

const docStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './src/models/public/docs');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const uploadWordDoc = multer({storage: docStorage}).single('image');


const WordDocumentSchema = new Schema({
    id: {
        type: String,
    },

    name: {
        type: String,
    },
});


const wordDocumentModel = Model("wordDocuments", WordDocumentSchema, "wordDocuments");

const addWordDocument = async (req, res) => {
    const inputData = [{
        id: req.body.id,
        name: req.body.name,
        //image: req.file.path,  //update this
    }];
    await wordDocumentModel.insertMany(inputData, function (data) {
        res.send('word document created successfully');
        console.log("word document was created successfully");
    });
};

const getWordDocument= async (req, res) => {
    wordDocumentModel.find(req.query, (err, docs) => {
        if (err) {
            res.send({
                message: "Error Occured",
                info: docs,
            });
            return 0;
        }

        if (docs === null || docs.length === 0) {
            res.send({
                message: "No such word document available",
                info: docs,
            });
            return 0;
        }

        res.send(
            {
                info: docs
            }
        );
    });
};


const deleteWordDocument = (req, res) => {
    wordDocumentModel.findByIdAndDelete(req.body.id, function (err) {
        if (err) console.log(err);
        console.log("word document successful deletion");
        res.send("word document successfully deleted");
    });
};

let Methods = {
    reverse_contains: function (txt, tst) {
        tst = tst.toUpperCase();
        txt = txt.toUpperCase();
        let len = tst.length;
        let flag = false;
        if (txt.substr(txt.length - len, len) === tst) {
            flag = true;
        }
        return flag;
    },
    capitalize: function (txt) {
        return txt[0].toUpperCase() + txt.slice(1, txt.length)
    },

    find: function (array, item) {
        if (array.length > 0) {
            return array.find(i => i === item) === item;
        }
    },
    remove: function (array, item) {
        if (Methods.find(array, item)) {
            array.splice(array.indexOf(item), 1);
        }
    },

    addToIndex: function (array, item, index) {
        array.splice(index, 0, item);
    },

    removeNode: function (element) {
        element.parentNode.removeChild(element);
    },
    reverse: function (str, separator, joiner, fromRight) {
        return str.split(`${separator || " "}`).reverse().join(`${joiner || " "}`)//.substr(0,str.length-1-(fromRight||0));
    },
    presert: function (concernedNode, concerned_parent, nodeAfter) {
        try {
            nodeAfter = concerned_parent.contains(nodeAfter) ? nodeAfter : null;
            concerned_parent.insertBefore(concernedNode, nodeAfter)
        } catch (e) {
            console.log("shit, a parent on a child?")
        }
    },
    getClassProperty: function (cls, property) {
        document.querySelectorAll(`${cls}`).forEach(function (el) {
            return el.style[`${property}`];
        })
    },
    changeClassProperty: function (cls, elements, property, newValue, oldValue) {
        document.querySelectorAll(`${cls}`).forEach(function (el) {
            Methods.find(elements, el) ? el.style[`${property}`] = newValue : el.style[`${property}`] = oldValue || el.style[`${property}`];
        })
    },

    addClass: function (cls, elements, newValue, oldValue) {
        document.querySelectorAll(`.${cls}`).forEach(function (el) {
            Methods.find(elements, el) ? el.classList.add(newValue) : el.classList.remove(oldValue);
        })
    },
    toogle: {
        display: function (element, start_state) {
            let display = element.style.display;
            display = display === "block" ? "none" : "block";
            element.style.display = display;
        },
        classes: function (element, class1, class2) {
            let cls = element.classList;
            if (cls.contains(`${class1}`)) {
                element.classList.remove(`${class1}`);
                element.classList.add(`${class2}`);
            } else if (cls.contains(`${class2}`)) {
                element.classList.remove(`${class2}`);
                element.classList.add(`${class1}`);
            } else {
                console.log("what?")
            }
        }
    },
    getIndex: (element) => {
        let i = 0;
        while ((element = element.previousSibling) !== null) {
            i++
        }
        return i;
    },
    getOffset: (el) => {
        return {
            top: window.scrollY + el.getBoundingClientRect().top,
            left: window.scrollX + el.getBoundingClientRect().left
        };
    },
    toNumber: (n) => {
        return isNaN(parseFloat(n)) ? 0 : parseFloat(n);
    },

    numberWithCommas: (x) => {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },

    getDate : (str) => {
        let obj = {};
        let date = new Date();

        switch (str) {
            case "This Month":
                obj.Start_date = new Date(date.getFullYear(), date.getMonth(), 1);
                obj.End_date = new Date(date.getFullYear(), date.getMonth() + 1, 0);
                break;
            case "Last Month":
                obj.End_date = new Date(date.setDate(0));
                obj.Start_date = new Date(date.setDate(1));
                break;

            case "This Year":
                obj.Start_date = new Date(date.getFullYear(), 0, 1);
                obj.End_date = new Date(date.getFullYear(), 11, 31);
                break;

            case "Last Year":
                obj.Start_date = new Date(date.getFullYear()-1, 0, 1);
                obj.End_date = new Date(date.getFullYear()-1, 11, 31);
                break;
        }
        return obj;
    },

    searchIntoArray: (array, my_query, field, specific_field = false) => {
        if (specific_field) {
            return array.filter((record) => {
                let flag = false;
                if (record[field].toString().toLowerCase().trim() === (my_query.toString().toLowerCase().trim())) {
                    flag = true;
                }
                return flag
            });
        } else {
            return array.filter((record) => {
                let flag = false;
                for (let i in record) {
                    if (record.hasOwnProperty(i)) {
                        if (i !== "_id") {
                            if (record[i].toString().toLowerCase().indexOf(my_query) > -1) {
                                flag = true;
                                break;
                            }
                        }
                    }
                }
                return flag
            });
        }
    }
};

module.exports = {
    uploadWordDoc,
    getWordDocument,
    deleteWordDocument,
    addWordDocument,
    Methods
};
