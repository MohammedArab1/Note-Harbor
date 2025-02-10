import { Types } from 'mongoose';

export interface ISource {
	_id?: string;
	source: string;
	additionalSourceInformation: string;
}

export interface INote {
	_id?: string;
	project?: string | IProject;
	subSection?: string | ISubSection;
	user?: string | IUser;
	content: string;
	dateCreated: Date;
	dateUpdated?: Date;
	sources?: ISource[];
}

export interface IComment {
	_id?: string;
	user: string | IUser;
	content: string;
	inReplyTo: string | IComment;
	dateCreated: Date;
	dateUpdated?: Date;
	note: string | INote;
}

export interface IProject {
	_id?: string;
	members?: string[] | IUser[];
	creationDate?: Date;
	accessCode?: string;
	leader?: string | IUser;
	projectName: string;
	description?: string;
	private: boolean;
}

export interface ISubSection {
	_id?: string;
	project: string | IProject;
	name: string;
	description?: string;
}

export interface ITag {
	_id?: string;
	project: string | IProject;
	tagName: string;
	notes?: Types.ObjectId[] | INote[];
	colour: string;
}

export interface IUser {
	_id?: string;
	firstName: string;
	lastName: string;
	password?: string;
	authProvider?: string;
	email: string;
	projects: string[] | IProject[];
}

type JwtPayload = {
	email: string;
	id: string;
};
declare global {
	namespace Express {
		export interface Request {
			auth: JwtPayload;
		}
		export interface Response {
			auth: JwtPayload;
		}
	}
}

export type ErrorPayload = {
	error: string;
};

export type LoginPayload = {
	token: string;
	user: IUser;
};

export type NoteWithTags = INote & {
	tags?: ITag[];
};

export type RegisterRequest =  {
	firstName:string,
	lastName:string,
	password:string,
	email:string
};

export type LoginRequest = {
	email:string,
	password:string,
	authProvider?:string
};

export type CustomModalProps = {
	opened: boolean
	close: () => void
}

export type GenericModalProps = {
	opened:boolean,
	close: () => void
	size?: string,
	title: string,
	children: React.ReactNode,
	bgColor?: string
}

export type Result<T, E> = { type: 'success'; data: T } | { type: 'error'; error: E }
