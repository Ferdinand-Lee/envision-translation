const fs = require('fs');
const path = require('path')
const stream = require('stream');
const jsforce = require('jsforce');
const unzip = require('unzip');
const archiver = require('archiver');

const xml2js = require('xml2js');
const builder = new xml2js.Builder(); // JSON->xml
const parser = new xml2js.Parser(); //xml -> json

const username = 'taiting.li@cognizant.com-test';
const password = 'Ltt@1991'

const { labels, zh_CN, en_US } = require('./parseXlsx')

const conn = new jsforce.Connection({
  loginUrl: 'https://test.salesforce.com'
});
conn.login(username, password)
  .then(userinfo => {
    const zipTransform = stream.Transform({
      transform(chunk, encoding, cb) {
        this.push(chunk);
        cb();
      }
    })
    const archive = archiver('zip');
    archive.pipe(zipTransform);
    conn.metadata.retrieve({
      apiVersion: '38.0',
      singlePackage: true,
      unpackaged: {
        types: [{
          'members': ['*'],
          'name': 'CustomLabels'
        }, {
          'members': ['*'],
          'name': 'Translations'
        }]
      }
    }).stream()
      .pipe(unzip.Parse())
      .on('entry', function (entry) {
        var fileName = entry.path;
        console.log(fileName);
        var body = '';
        entry.on('data', (chunk) => {
          body += chunk;
        }).on('end', () => {
          parser.parseString(body, (err, data) => {
            if (fileName == 'labels/CustomLabels.labels') {
              data.CustomLabels.labels = labels;
            } else if (fileName == 'translations/en_US.translation') {
              data.Translations.customLabels = en_US;
            } else if (fileName == 'translations/zh_CN.translation') {
              data.Translations.customLabels = zh_CN;
            }
            archive.append(builder.buildObject(data), { name: 'unpackage/' + fileName });
          })
        })
      }).on('close', () => {
        conn.metadata.deploy(zipTransform)
          .complete((err, res) => {
            console.log(res)
          });
        archive.finalize();
      })
  })
