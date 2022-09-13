//Import table data structures and methods for adding to each respective table
import { WordModel, addToWord } from './Model/Dictionary/Word'
import { CategoryModel, addToCategory } from './Model/Dictionary/Category';
import { WordCategoryModel, addToWordCategory } from './Model/Dictionary/WordCategory';
import { WordDefinitionModel, addToWordDefinition } from './Model/Dictionary/WordDefinition';
//import { WordInEnglishModel, addToWordInEnglish } from './Model/Dictionary/WordInEnglish';
import { WordRelationModel, addToWordRelation } from './Model/Dictionary/WordRelation';
import { map } from '../API/v1/v1MainRouter';

//Read from file system
import fs from 'fs';
import path from 'path';
import StreamArray from 'stream-json/streamers/StreamArray';
import { Writable } from 'stream';
 
//=================== THIS FILE WAS USED TO INITIALLY FILL THE DATABASE, SHOULD NOT BE USED ===================

//goal: 118,031
export async function loadDefinitionDataSansRelationWith(dbEntry: map) {

    const filePath = path.join(__dirname, '/Data/DBData.json');
    const fileStream = fs.createReadStream(filePath);
    const jsonStream = StreamArray.withParser();

    let defErrors : string = '';
    let defCount = 0;
    let catErrors : string = '';
    let catCount = 0;

    let numEntries = 0;

    const processingStream = new Writable({
        write({key, value}, encoding, callback) {

            //some async operations
            setTimeout(() => {
                //console.log(key,value);
                //Runs one at a time, need to use a callback for that part to work
                callback();
            }, 1.25);

            if('WordID' in value && 'Definition' in value) { 
                defCount += value.Definition.length;
                addWordDefinitionData(value.WordID, value.Definition)
                .then(() => {
                    console.log('Def Insert Successful');
                    if(!dbEntry.map[value.WordID]) {
                        numEntries++;
                        dbEntry.map[value.WordID] = true;
                    }
                    if('Categorie' in value) {
                        catCount += value.Categorie.length;
                        addWordCategorieData(value.WordID, value.Categorie)
                        .then(() => console.log('Def Insert Successful'))
                        .catch(err => {
                            console.log(err.toString());
                            catErrors += (err.toString() + '\n');
                        });
                    }
                })
                .catch(err => {
                    console.log(err.toString());
                    defErrors += (err.toString() + '\n');
                });
            }

        },

        objectMode: true
    });

    fileStream.pipe(jsonStream);
    jsonStream.pipe(processingStream);

    processingStream.on('finish', () => {
        console.log(`All Done!\n Total Definitions Expected: ${defCount}\nDef Errors:\n${defErrors}\nTotal Categories Expected: ${catCount}\nCat Errors:\n${catErrors}\nTotal Number of Words: ${numEntries}`);
    });

}

//114235
export async function loadDefinitionDataRelationWith(dbEntry: map) {

    const filePath = path.join(__dirname, '/Data/DBData.json');
    const fileStream = fs.createReadStream(filePath);
    const jsonStream = StreamArray.withParser();

    let errors : string = '';
    let count = 0;

    const processingStream = new Writable({
        write({key, value}, encoding, callback) {

            //some async operations
            setTimeout(() => {
                //console.log(key,value);
                //Runs one at a time, need to use a callback for that part to work
                callback();
            }, 1);

    
            if('RelationWith' in value && 'WordID' in value && dbEntry.map[value.WordID]) {
                count += value.RelationWith.length;
                addWordRelationData(value.WordID, value.RelationWith, dbEntry)
                .then(() => console.log('Rel Insert Successful'))
                .catch(err => {
                    console.log(err.toString());
                    errors += (err.toString() + '\n');
                });
            }  
        },

        objectMode: true
    });

    fileStream.pipe(jsonStream);
    jsonStream.pipe(processingStream);

    processingStream.on('finish', () => {
        console.log(`All Done!\n Total Relations Expected: ${count}\nRel Errors:\n${errors}`);
    });

}


export async function loadCategoryData() {

    const filePath = path.join(__dirname, '/Data/WordCategories.json');
    const fileStream = fs.createReadStream(filePath);
    const jsonStream = StreamArray.withParser();

    let errors : string = '';
    let count = 0;

    const processingStream = new Writable({
        write({key, value}, encoding, callback) {

            //some async operations
            setTimeout(() => {
                //console.log(key,value);
                //Runs one at a time, need to use a callback for that part to work
                count++;
                callback();
            }, 1);

            if('CategorieName' in value && 'CategorieID' in value) {
                let categorieModel : CategoryModel = {
                    CategoryID: value.CategorieID,
                    CategoryName: value.CategorieName 
                };
                addToCategory(categorieModel)
                .then(() => console.log('Insert Successful'))
                .catch(err => {
                    console.log(err.toString());
                    errors += (err.toString() + '\n');
                });
            }

        },

        objectMode: true
    });

    fileStream.pipe(jsonStream);
    jsonStream.pipe(processingStream);

    processingStream.on('finish', () => {
        console.log(`All Done!\n Total Categories Expected: ${count}\nCat Errors:\n${errors}`);
    });

}


export async function loadWordData(dbEntry: map) {

    const filePath = path.join(__dirname, '/Data/WordData.json');
    const fileStream = fs.createReadStream(filePath);
    const jsonStream = StreamArray.withParser();

    let errors : string = '';
    let count = 0;

    const processingStream = new Writable({
        write({key, value}, encoding, callback) {

            //some async operations
            setTimeout(() => {
                //Runs one at a time, need to use a callback for that part to work
                callback();
            }, 2);

            //This count should equal num entries in add definition data
            if('WordName' in value && 'WordID' in value && dbEntry.map[value.WordID]) {
                count++;
                let wordModel : WordModel = {
                    WordID: value.WordID,
                    WordName: value.WordName 
                };
                addToWord(wordModel)
                .then(() => console.log('Insert Successful'))
                .catch(err => {
                    console.log(err.toString());
                    errors += (err.toString() + '\n');
                });
            }

        },

        objectMode: true
    });

    fileStream.pipe(jsonStream);
    jsonStream.pipe(processingStream);

    processingStream.on('finish', () => {
        console.log(`All Done!\n Total Words Expected: ${count}\nWord Errors:\n${errors}`);
    });
    
}


async function addWordDefinitionData(wordID: number, Definition: string[]) {

    let thisModel : WordDefinitionModel;

    Definition.forEach(async (def) => {
        thisModel = {
            WordID: wordID,
            Definition: def
        };

        await addToWordDefinition(thisModel)
        .catch(err => {
            console.log(err.message);
        });

    });

}


async function addWordRelationData(wordID: number, Definition: number[], dbEntry: map) {

    Definition.forEach(async (rel) => {
        if(dbEntry.map[rel]) {
            const thisModel : WordRelationModel = {
                WordID: wordID,
                RelationID: rel
            };
            await addToWordRelation(thisModel)
            .catch(err => {
                console.log(err.toString());
            });
        }
    });

}

async function addWordCategorieData(wordID: number, Definition: number[]) {

    Definition.forEach(async (cat) => {
        const thisModel : WordCategoryModel = {
            WordID: wordID,
            CategoryID: cat
        };
        await addToWordCategory(thisModel)
        .catch(err => {
            console.log(err.toString());
        });
    });

}

