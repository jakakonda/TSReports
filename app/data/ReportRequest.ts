export interface ITemplate {
    name: string|null,
    language: string
}

export interface IOptions {

}

export interface IReportRequest {
    template: ITemplate,
    options: IOptions|null;
    data: null|object;
}