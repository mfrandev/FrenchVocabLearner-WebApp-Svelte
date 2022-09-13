import { loadDefinitionDataSansRelationWith, loadDefinitionDataRelationWith, loadWordData, loadCategoryData } from '../../Database/FillDB';
import { dbEntry } from './v1MainRouter';
import express from 'express';

//Router used to load data (SHOULD NOT NORMALLY BE MOUNTED)
export const routerLoadData = express.Router();

/**
 * ===============IMPORTANT===============
 * The order of each endpoint must be respected due to foreign key restraints in the database
 */

//First load the category data
routerLoadData.get('/firstLoad', async (req, res) => {
  await loadCategoryData().then(
    () => {
     res.send('Done loading category data :)');
    }
  );
});

//Next, load the definition data without the word relations
routerLoadData.get('/secondLoad', async (req, res) => {
   await loadDefinitionDataSansRelationWith(dbEntry).then(
     () => {
      res.send('Done loading definition data without relation with:)');
     }
   );
});

//Third, load the word relations
routerLoadData.get('/thirdLoad', async (req, res) => {
  await loadDefinitionDataRelationWith(dbEntry).then(
    () => {
     res.send('Done loading relation with :)');
    }
  );
});

//Finally, load all of the word data
routerLoadData.get('/finalLoad', async (req, res) => {
  await loadWordData(dbEntry).then(
    () => {
     res.send('Done loading Word data :)');
    }
  );
});