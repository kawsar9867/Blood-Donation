import districtsJson from '../assets/data/districts.json';
import upazilasJson from '../assets/data/upazilas.json';

const districtsTable = districtsJson.find(item => item.name === 'districts');
const upazilasTable = upazilasJson.find(item => item.name === 'upazilas');

export const districts = districtsTable ? districtsTable.data : [];
export const upazilas = upazilasTable ? upazilasTable.data : [];
