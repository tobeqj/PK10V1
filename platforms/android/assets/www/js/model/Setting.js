var Setting = function(num, danshuang, daxiao, batchId) {
    this.num = num;
    this.danshuang = danshuang;
    this.daxiao = daxiao;
    this.batchId = batchId;
};

var SettingBatch = function (cycle, modifyTime) {
    this.cycle = cycle;
    this.modifyTime = modifyTime.format("yyyy-MM-dd hh:mm:ss");
}