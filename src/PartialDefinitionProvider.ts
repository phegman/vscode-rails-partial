import * as path from "path";
import * as fs from "fs";
import {
  DefinitionProvider,
  Range,
  TextDocument,
  LocationLink,
  Position,
  Uri,
  workspace,
} from "vscode";

export default class PartialDefinitionProvider implements DefinitionProvider {
  constructor(private rootPath: string) {}

  public async provideDefinition(document: TextDocument, position: Position) {
    const renderMethods: string[] =
      workspace.getConfiguration("railsPartial").renderMethods;

    const line = document.lineAt(position.line).text;
    if (renderMethods.every((method) => !line.includes(method))) {
      return null;
    }

    const partialName = this.partialName(line);
    if (!partialName) {
      return null;
    }

    const range = document.getWordRangeAtPosition(position, /[\w/]+/);
    if (!range) {
      return null;
    }

    return this.partialLocation(document.fileName, partialName, range);
  }

  private partialName(line: string) {
    const renderMethods: string[] =
      workspace.getConfiguration("railsPartial").renderMethods;
    const renderMethodsNonCapturingGroup = `(?:${renderMethods.join("|")})`;

    const regex = line.includes("partial")
      ? new RegExp(
          `${renderMethodsNonCapturingGroup}\\s*\\(?\s*\\:?partial(?:\\s*=>|:*)\\s*["'](.+?)["']`
        )
      : new RegExp(
          `${renderMethodsNonCapturingGroup}\\s*\\(?\\s*["'](.+?)["']`
        );
    const result = line.match(regex);
    return result ? result[1] : null;
  }

  private partialLocation(
    currentFileName: string,
    partialName: string,
    originSelectionRange: Range
  ): LocationLink[] | null {
    const viewFileExtensions: string[] =
      workspace.getConfiguration("railsPartial").viewFileExtensions;
    const viewFilePaths: string[] =
      workspace.getConfiguration("railsPartial").viewFilePaths;

    const basePaths = partialName.includes("/")
      ? viewFilePaths.map((viewFilePath) => {
          const viewFilePathAsArray = viewFilePath.split("/");

          return path.join(
            this.rootPath,
            ...viewFilePathAsArray,
            path.dirname(partialName),
            `_${path.basename(partialName)}`
          );
        })
      : [path.join(path.dirname(currentFileName), `_${partialName}`)];

    const targetViewFilePath = basePaths.reduce((accumulator, basePath) => {
      const extension = viewFileExtensions.find((extension) => {
        try {
          fs.accessSync(`${basePath}.${extension}`, fs.constants.R_OK);
          return true;
        } catch (error) {
          return false;
        }
      });

      if (!extension) {
        return accumulator;
      }

      return `${basePath}.${extension}`;
    }, "");

    if (targetViewFilePath === "") {
      return null;
    }

    return [
      {
        originSelectionRange,
        targetUri: Uri.file(targetViewFilePath),
        targetRange: new Range(new Position(0, 0), new Position(0, 0)),
      },
    ];
  }
}
