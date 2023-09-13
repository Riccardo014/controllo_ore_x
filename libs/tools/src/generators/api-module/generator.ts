import { generateFiles, getProjects, names, Tree } from '@nrwl/devkit';
import {
  ArrayLiteralExpression,
  CallExpression,
  ObjectLiteralExpression,
  Project,
  PropertyAssignment,
  SyntaxKind,
} from 'ts-morph';

interface SchemaInterface {
  name: string;
  module?: string;
}

export default async function (tree: Tree, schema: SchemaInterface) {
  const apiFolder = getProjects(tree).get('api');
  const apiInterfacesFolder = getProjects(tree).get('api-interfaces');

  const schemaNames = names(schema.name);

  const substitutions = {
    tmpl: '',
    ...schemaNames,
    moduleName: schema.module || schemaNames.fileName,
  };

  generateFiles(
    tree,
    'libs/tools/src/generators/api-module/module-templates',
    `${apiFolder.sourceRoot}/app/modules/${substitutions.moduleName}`,
    substitutions
  );

  generateFiles(
    tree,
    'libs/tools/src/generators/api-module/dto-templates',
    `${apiInterfacesFolder.sourceRoot}/dto/${substitutions.moduleName}`,
    substitutions
  );

  // Update file to export dto in api-interfaces/index.ts
  const apiInterfaceProject = new Project();
  apiInterfaceProject.addSourceFileAtPath(`${apiInterfacesFolder.sourceRoot}/index.ts`);
  const src = apiInterfaceProject.getSourceFile('index.ts');
  src.addExportDeclaration({
    moduleSpecifier: `./dto/${substitutions.moduleName}/${schemaNames.fileName}.dto`,
  });
  await src.save();

  if (schema.module) {
    const moduleNames = names(schema.module);
    const project = new Project();
    project.addSourceFilesAtPaths(`${apiFolder.sourceRoot}/app/modules/${schema.module}/*.module.ts`);
    const sourceFile = project.getSourceFile(`${moduleNames.fileName}.module.ts`);

    // Adding imports
    sourceFile.addImportDeclaration({
      namedImports: [`${schemaNames.className}Controller`],
      moduleSpecifier: `@modules/${moduleNames.fileName}/controllers/${schemaNames.fileName}.controller`,
    });
    sourceFile.addImportDeclaration({
      namedImports: [`${schemaNames.className}Service`],
      moduleSpecifier: `@modules/${moduleNames.fileName}/services/${schemaNames.fileName}.service`,
    });
    sourceFile.addImportDeclaration({
      namedImports: [`${schemaNames.className}`],
      moduleSpecifier: `@modules/${moduleNames.fileName}/entities/${schemaNames.fileName}.entity`,
    });

    const x = sourceFile
      .getClass(`${moduleNames.className}Module`)
      .getDecorator('Module')
      .getArguments()[0] as ObjectLiteralExpression;

    for (const arg of x.getProperties() as PropertyAssignment[]) {
      switch (arg.getName()) {
        case 'imports':
          (
            (
              arg.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression).getElements()[0] as CallExpression
            ).getArguments()[0] as ArrayLiteralExpression
          ).addElement(`${schemaNames.className}`);
          break;
        case 'controllers':
          arg.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression).addElement(`${schemaNames.className}Controller`);
          break;
        case 'exports':
          arg.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression).addElement(`${schemaNames.className}Service`);
          break;
        case 'providers':
          arg.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression).addElement(`${schemaNames.className}Service`);
          break;
      }
    }
    await sourceFile.save();
  } else {
    generateFiles(
      tree,
      'libs/tools/src/generators/api-module/module-declaration-templates',
      `${apiFolder.sourceRoot}/app/modules/${substitutions.moduleName}`,
      substitutions
    );
  }
}
