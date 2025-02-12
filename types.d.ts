import { Types } from 'mongoose';

export interface ISource {
	_id?: string;
	source: string;
	additionalSourceInformation: string;
}

export interface INote {
	_id?: string;
	project?: string;
	subSection?: string;
	user?: string;
	content: string;
	dateCreated: Date;
	dateUpdated?: Date;
	sources?: string[];
}

export interface IComment {
	_id?: string;
	user: string;
	content: string;
	inReplyTo: string;
	dateCreated: Date;
	dateUpdated?: Date;
	note: string;
}

export interface IProject {
	_id?: string;
	members?: string[];
	creationDate?: Date;
	accessCode?: string;
	leader?: string;
	projectName: string;
	description?: string;
	private: boolean;
}

export interface ISubSection {
	_id?: string;
	project: string;
	name: string;
	description?: string;
}

export interface ITag {
	_id?: string;
	project?: string;
	tagName?: string;
	notes?: string[];
	colour?: string;
}

export interface IUser {
	_id?: string;
	firstName: string;
	lastName: string;
	password?: string;
	authProvider?: string;
	email: string;
	projects: string[];
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
	tags?: string[];
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
