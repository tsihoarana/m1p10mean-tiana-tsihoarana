class CustomResponse {
    constructor(status, message, datas = {}) {
        this.status = status;
        this.message = message;
        this.datas = datas;
    }
}

module.exports = CustomResponse;