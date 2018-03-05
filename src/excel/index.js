import FileSaver from "file-saver";
import XLSX from "xlsx";

export default (dom,filename) => {
        /* generate workbook object from table */
        var wb = XLSX.utils.table_to_book(dom);
        /* get binary string as output */
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: false,
          type: "binary"
        });
        try {
          FileSaver.saveAs(
            new Blob([s2ab(wbout)], { type: "application/octet-stream" }),
            filename
          );
        } catch (e) {
          if (typeof console !== "undefined") console.log(e, wbout);
        }
        return wbout;
}

export const s2ab = (s) => {
    if (typeof ArrayBuffer !== "undefined") {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (let i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff;
        return buf;
      } else {
        var buf = new Array(s.length);
        for (let i = 0; i != s.length; ++i) buf[i] = s.charCodeAt(i) & 0xff;
        return buf;
      }
}
