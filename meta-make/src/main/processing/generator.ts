import DataManager from "../data/DataManager";
import { Catalogue } from '../dcr/core/Catalogue.js';

export default async function generateMetadata() {
  const data = await DataManager.dataSource.getData(5000);

  console.log("getData", data.length);

  const catalogue = new Catalogue();
  catalogue.setData({data})

  console.log(catalogue.usetypes);
}
