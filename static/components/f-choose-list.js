import { dom, push } from "./utils.js";
import { Field } from "./field.js";

customElements.define(
  "f-choose-list",
  class extends Field {
    init() {
      this.classList.add("field");

      const { schema, value } = this;
      const namePrefix = `${this.namePrefix}.${schema.name}`;
      let open = true;

      push(this, "label", {
        for: `field_${namePrefix}.0`,
        onclick: () => {
          open = !open;
          this.querySelectorAll("details.accordion").forEach((el) =>
            el.open = open
          );
        },
      }, schema.label);

      if (schema.description) {
        push(this, "div", { class: "field-description" }, schema.description);
      }

      const div = push(this, "div", { class: "fieldset" });
      let index = 0;

      function addOption(value, isNew = false) {
        const field = schema.fields.find((f) => f.name === value.type);
        if (!field) {
          throw new Error(`Unknown field type: ${value.type}`);
        }

        const open = field.attributes?.open ?? isNew;
        ++index;

        push(
          div,
          field.tag,
          {
            schema: {
              ...field,
              attributes: { ...field.attributes, open },
              name: index,
              label: field.label || field.name,
              fields: [
                {
                  name: "type",
                  tag: "f-hidden",
                },
                ...field.fields,
              ],
            },
            namePrefix,
            value,
          },
          dom("button", {
            type: "button",
            class: "buttonIcon",
            slot: "buttons",
            onclick() {
              this.closest("u-draggable").remove();
            },
          }, '<u-icon name="trash"></u-icon>'),
          dom("u-draggable", { slot: "buttons" }),
        );
      }

      for (const v of value ?? []) {
        addOption(v);
      }

      const footer = push(this, "footer", {
        class: "field-footer ly-rowStack",
      });

      for (const field of schema.fields) {
        push(
          footer,
          "button",
          {
            type: "button",
            onclick: () => addOption({ type: field.name }, true),
            class: "button is-secondary",
          },
          '<u-icon name="plus-circle"></u-icon>',
          `Add ${field.label ?? field.name}`,
        );
      }
    }
  },
);
