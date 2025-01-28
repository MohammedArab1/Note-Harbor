import Dexie, { type EntityTable } from 'dexie';
import { IProject, ISubSection,INote,ITag,IComment } from '../types';


export const db = new Dexie('offlineDB6') as Dexie & {
	project: EntityTable<IProject,'_id'>
	subSection: EntityTable<ISubSection,'_id'>
	note: EntityTable<INote,'_id'>
	tag: EntityTable<ITag,'_id'>
	comment: EntityTable<IComment,'_id'> 
};


db.version(1).stores({
	project: '++_id, creationDate, projectName, description, accessCode, leader, private',
	subSection: '++_id,project,name,description', //project refers to id in project table
	note: '++_id,project,subSection,content,dateCreated,dateUpdated,*sources', //project and subSection refer to id in project and subSection tables. Sources refers to source table
	tag: '++_id,project,tagName,*notes,colour', //project refers to id in project table, notes refers to id in note table
	comment: '++_id,content,inReplyTo,dateCreated,dateUpdated,note', //note refers to id in note table. inReplyTo refers to id in comment table
});
