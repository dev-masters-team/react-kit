# DevMasters shared logic
to publish new dev version please use `npm run release:dev` it will make and push new tag for this package like: _X.X.X+1_

***keep in mind to update package version _package.json_ in projects that are using this package where it is necessary*** 

to test this package locally follow this steps:
1. `npm install -g npm-sync`
2. in auxasphere-react-kit project execute `npm run typescript:build`
3. then in project you are using this lib run `rm -rf ./node_modules/auxasphere-react-kit/ && npm-sync --src /home/bogdan/TemmaCare/auxasphere-react-kit/ --dest /home/bogdan/TemmaCare/min-app-auxasphere-react-kits/ --yes` p.s. don't need to stop server to see changesL
4. in project that use this package run  `npm install auxasphere-react-kit`