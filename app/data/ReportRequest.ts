export interface ITemplate {
    name: string,
    language?: string,
    type?: string,
}

export interface IOptions {

}

export interface IReportRequest {
    template?: ITemplate,
    options?: IOptions;
    data: null|object;
}