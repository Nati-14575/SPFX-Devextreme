import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPHttpClient, ISPHttpClientOptions } from "@microsoft/sp-http";
import * as $ from "jquery";
const getHeader = {
  headers: {
    accept: "application/json;",
  },
};
const postHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    accept: "application/json;odata.metadata=full",
  },
};
const deleteHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    "IF-MATCH": "*",
    "X-HTTP-Method": "DELETE",
  },
};
const updateHeader = {
  headers: {
    "content-type": "application/json;odata.metadata=full",
    accept: "application/json;odata.metadata=full",
    "X-HTTP-Method": "MERGE",
    "IF-MATCH": "*",
  },
};

export default class SPService {
  constructor(private context: WebPartContext) {}

  public webUrl = this.context.pageContext.web.absoluteUrl;
  public serverUrl = this.context.pageContext.web.serverRelativeUrl;
  public formDigest;
  postFileByServerRelativeUrl(serverRelativeUrl, file): Promise<any> {
    const url: string =
      this.webUrl +
      "/_api/web/getFolderByServerRelativeUrl('" +
      serverRelativeUrl +
      "')/files/add(url='" +
      file.name +
      "',overwrite=true)?$expand=ListItemAllFields";

    const options: ISPHttpClientOptions = {
      headers: postHeader.headers,
      body: file,
    };

    return this.post(url, options)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }

  getHttpRequestDigest(handleData): any {
    return $.ajax({
      url: this.webUrl + "/_api/contextinfo",
      type: "POST",
      headers: {
        accept: "application/json;odata=verbose",
        contentType: "text/xml",
      },
      success: function (data) {
        handleData(data.d.GetContextWebInformation.FormDigestValue);
      },
      error: function (err) {
        console.log(JSON.stringify(err));
      },
    });
  }

  handleDigestData = (digest) => {
    this.formDigest = digest;
  };

  async postArrayBufferByServerRelativeUrl(
    arrayBuffer,
    serverRelativeUrl,
    fileName
  ) {
    await this.getHttpRequestDigest(this.handleDigestData);
    const url: string =
      this.webUrl +
      "/_api/web/getFolderByServerRelativeUrl('" +
      serverRelativeUrl +
      "')/files/add(url='" +
      fileName +
      "',overwrite=true)";
    const header = {
      accept: "application/json;odata=verbose",
      "X-RequestDigest": this.formDigest,
      "content-length": arrayBuffer.byteLength,
    };
    return $.ajax({
      url: url,
      type: "POST",
      data: arrayBuffer,
      processData: false,
      headers: header,
    });
  }

  postFile(listName, file, fileName): Promise<any> {
    const url: string =
      this.webUrl +
      "/_api/web/lists/getByTitle('" +
      listName +
      "')/RootFolder/files/add(url='" +
      fileName +
      "',overwrite=true)?$expand=ListItemAllFields";

    const options: ISPHttpClientOptions = {
      headers: postHeader.headers,
      body: file,
    };
    return this.post(url, options)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }

  getFilteredItems(listName: string, query): Promise<any> {
    const url: string =
      this.webUrl +
      "/_api/web/lists/getByTitle('" +
      listName +
      "')/items" +
      query;

    return this.get(url)
      .then((result) => {
        return result;
      })
      .catch((err) => {
        return err;
      });
  }

  getAllFiles(serverRelativeUrl: string): Promise<any> {
    const restUrl = `${this.webUrl}/_api/web/getFolderByServerRelativeUrl('${serverRelativeUrl}')/files?$expand=ListItemAllFields`;
    return this.get(restUrl).then((json) => {
      return json;
    });
  }

  getFileContent(serverRelativeUrl, fileName) {
    const restUrl = `${this.webUrl}/_api/web/getFolderByServerRelativeUrl('${serverRelativeUrl}')/files('${fileName}')/$value`;

    return this.get(restUrl).then((json) => {
      console.log(json);
      // let blobTest = new Blob([json]),{};
      // console.log(blobTest);
      return json;
    });
  }
  getLibraryInformationByName(libraryName: string): Promise<any> {
    const restUrl = `${this.webUrl}/_api/web/folders?$filter=Name eq '${libraryName}'`;
    return this.get(restUrl)
      .then((json) => {
        return json;
      })
      .catch((err) => {
        return err;
      });
  }

  get(url: string) {
    return this.context.spHttpClient
      .get(url, SPHttpClient.configurations.v1, {
        headers: getHeader.headers,
      })
      .then(async (response) => {
        return response.json().then((json) => {
          return json;
        });
      })
      .catch((err) => {
        return err;
      });
  }

  async post(url: string, postInformation): Promise<any> {
    const options: ISPHttpClientOptions = {
      headers: postInformation.headers,
      body: JSON.stringify(postInformation.body),
    };
    return this.context.spHttpClient
      .post(url, SPHttpClient.configurations.v1, options)
      .then((response) => {
        return response.json().then((json) => {
          return json;
        });
      })
      .catch((err) => {
        return err;
      });
  }
}
