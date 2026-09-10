/**
 * Material Design 3 ESLint Rules: Icons
 * Disallows raw svg elements and enforces rounded, unfilled Material Design 3 icons.
 */

export const iconRules = {
  "no-raw-svg-icons": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Disallow raw <svg> elements and custom SVG glyph paths for icons. Use standard Material Design 3 rounded icons or <Icon /> instead.",
      },
      messages: {
        noRawSvgIcon:
          "Raw <svg> elements for icons are forbidden. Use standard Material Design 3 rounded icons from '@mui/icons-material/*Rounded' or '<Icon />' instead.",
        noCustomStyledSvgIcon:
          "Custom styled('svg') icon '{{name}}' is forbidden. Use standard Material Design 3 rounded icons or '<Icon />' instead.",
        noCustomGlyphPath:
          "Hardcoding custom SVG icon path glyphs ('{{name}}') is forbidden. Use standard Material Design 3 rounded icons instead.",
      },
    },
    create(context) {
      const exemptFiles = [
        "ShapeDefs",
        "ClipDefs",
        "Guilloche",
        "Electronics",
        "CelestialGlyphs",
        "MeridianGlyphs",
        "planning.styles",
        "planning.test",
        "m3-eslint-rules.test.ts",
      ];
      const filename = context.filename || "";
      if (exemptFiles.some((exempt) => filename.includes(exempt))) return {};

      return {
        JSXOpeningElement(node) {
          if (node.name?.type === "JSXIdentifier" && node.name.name === "svg") {
            context.report({ node, messageId: "noRawSvgIcon" });
          }
        },
        CallExpression(node) {
          if (
            node.callee?.name === "styled" &&
            node.arguments?.[0]?.value === "svg"
          ) {
            if (node.parent?.type === "VariableDeclarator") {
              const varName = node.parent.id?.name || "";
              if (/(Icon|Glyph)$/i.test(varName)) {
                context.report({
                  node: node.parent,
                  messageId: "noCustomStyledSvgIcon",
                  data: { name: varName },
                });
              }
            }
          }
        },
        VariableDeclarator(node) {
          if (
            node.id?.type === "Identifier" &&
            /(_ICON_PATH|_GLYPH_PATH)$/i.test(node.id.name)
          ) {
            context.report({
              node,
              messageId: "noCustomGlyphPath",
              data: { name: node.id.name },
            });
          }
        },
      };
    },
  },

  "enforce-rounded-icons": {
    meta: {
      type: "problem",
      fixable: "code",
      docs: {
        description:
          "Enforce rounded, unfilled icons from @mui/icons-material per Material Design 3 specifications.",
      },
      messages: {
        useRoundedIcon:
          "Material Design 3 requires rounded icons. Use '@mui/icons-material/{{suggested}}' instead of '@mui/icons-material/{{current}}'.",
        useUnfilledIcon:
          "Material Design 3 requires unfilled (FILL: 0) icons. Use '@mui/icons-material/{{suggested}}' instead of '@mui/icons-material/{{current}}'.",
      },
    },
    create(context) {
      const brandExceptions = new Set(["GitHub", "LinkedIn"]);
      const filledToOutlineMap = {
        CheckCircleRounded: "CheckCircleOutlineRounded",
        DeleteRounded: "DeleteOutlineRounded",
        ErrorRounded: "ErrorOutlineRounded",
        InfoRounded: "InfoOutlineRounded",
        LockRounded: "LockOutlineRounded",
      };

      function createIconFix(node, iconModule, suggested, fixer) {
        const fixes = [
          fixer.replaceText(node.source, `"@mui/icons-material/${suggested}"`),
        ];
        const defaultSpec = node.specifiers?.find(
          (s) => s.type === "ImportDefaultSpecifier",
        );
        if (defaultSpec && defaultSpec.local.name === `${iconModule}Icon`) {
          fixes.push(fixer.replaceText(defaultSpec.local, `${suggested}Icon`));
        }
        return fixes;
      }

      return {
        ImportDeclaration(node) {
          const importSource = node.source.value;
          if (
            typeof importSource !== "string" ||
            !importSource.startsWith("@mui/icons-material/")
          ) {
            return;
          }
          const iconModule = importSource.slice("@mui/icons-material/".length);
          if (brandExceptions.has(iconModule)) return;

          if (!iconModule.endsWith("Rounded")) {
            const suggested = `${iconModule}Rounded`;
            context.report({
              node,
              messageId: "useRoundedIcon",
              data: { current: iconModule, suggested },
              fix: (fixer) => createIconFix(node, iconModule, suggested, fixer),
            });
          } else if (filledToOutlineMap[iconModule]) {
            const suggested = filledToOutlineMap[iconModule];
            context.report({
              node,
              messageId: "useUnfilledIcon",
              data: { current: iconModule, suggested },
              fix: (fixer) => createIconFix(node, iconModule, suggested, fixer),
            });
          }
        },
      };
    },
  },

  "enforce-icon-tokens": {
    meta: {
      type: "problem",
      docs: {
        description:
          "Enforce Material Design 3 icon dimension tokens across <Icon /> and MUI icon primitives.",
      },
      messages: {
        nonStandardIconSize:
          "Non-standard icon size '{{value}}' detected. Use Material Design 3 icon dimension tokens from '~/tokens/spacing' (e.g. 'M3_DIMENSIONS.iconSmall' [18], 'iconInline' [20], 'iconStandard' [24], 'iconLarge' [32], 'iconHuge' [48]) or approved CSS variables.",
      },
    },
    create(context) {
      const APPROVED_ICON_SIZES = new Set([14, 16, 18, 20, 24, 28, 32, 40, 48]);
      const APPROVED_STRING_KEYWORDS = new Set([
        "inherit",
        "small",
        "medium",
        "large",
        "1em",
        "1.1em",
        "1.2em",
        "1.25rem",
        "1.5rem",
        "2rem",
      ]);

      function checkSize(valNode, reportNode) {
        if (!valNode) return;
        if (valNode.type === "Literal") {
          const val = valNode.value;
          if (typeof val === "number") {
            if (!APPROVED_ICON_SIZES.has(val)) {
              context.report({
                node: reportNode,
                messageId: "nonStandardIconSize",
                data: { value: String(val) },
              });
            }
          } else if (typeof val === "string") {
            const trimmed = val.trim();
            if (
              APPROVED_STRING_KEYWORDS.has(trimmed.toLowerCase()) ||
              trimmed.startsWith("var(--")
            ) {
              return;
            }
            const pxMatch = /^(\d+(?:\.\d+)?)px$/i.exec(trimmed);
            if (pxMatch && APPROVED_ICON_SIZES.has(parseFloat(pxMatch[1]))) {
              return;
            }
            context.report({
              node: reportNode,
              messageId: "nonStandardIconSize",
              data: { value: trimmed },
            });
          }
        }
      }

      function inspectSxProperties(properties) {
        for (const prop of properties || []) {
          if (prop.type !== "Property") continue;
          const key = prop.key?.name || prop.key?.value;
          if (key === "fontSize" || key === "width" || key === "height") {
            checkSize(prop.value, prop);
          }
        }
      }

      return {
        JSXOpeningElement(node) {
          const tagName = node.name?.name || "";
          const isIconElement =
            tagName === "Icon" ||
            tagName === "SvgIcon" ||
            tagName.endsWith("Icon") ||
            tagName.endsWith("RoundedIcon");

          if (!isIconElement) return;

          for (const attr of node.attributes || []) {
            if (attr.type !== "JSXAttribute") continue;
            const attrName = attr.name?.name;
            if (attrName === "size" || attrName === "fontSize") {
              const valNode = attr.value?.expression || attr.value;
              checkSize(valNode, attr);
            } else if (
              attrName === "sx" &&
              attr.value?.expression?.type === "ObjectExpression"
            ) {
              inspectSxProperties(attr.value.expression.properties);
            }
          }
        },
      };
    },
  },
};
