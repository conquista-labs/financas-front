import { Box, Text } from "@rarui-react/components";
import type { ComponentProps } from "react";

function Table({ style, ...props }: ComponentProps<"table">) {
  return (
    <Box
      data-slot="table-container"
      position="relative"
      overflowX="auto"
      width="100%"
    >
      <table
        data-slot="table"
        style={{
          tableLayout: "fixed",
          width: "100%",
          captionSide: "bottom",
          fontSize: "0.875rem",
          ...style,
        }}
        {...props}
      />
    </Box>
  );
}

function TableHeader({ style, ...props }: ComponentProps<"thead">) {
  return (
    <thead
      data-slot="table-header"
      style={{
        textTransform: "uppercase",
        borderBottom: "1px solid #e5e7eb",
        ...style,
      }}
      {...props}
    />
  );
}

function TableBody({ style, ...props }: ComponentProps<"tbody">) {
  return (
    <tbody
      data-slot="table-body"
      style={{
        ...style,
      }}
      {...props}
    />
  );
}

function TableRow({ style, ...props }: ComponentProps<"tr">) {
  return (
    <tr
      data-slot="table-row"
      style={{
        borderBottom: "1px solid #e5e7eb",
        transition: "background-color 0.2s",
        cursor: "default",
        ...style,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = "rgba(243, 244, 246, 0.5)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = "";
      }}
      {...props}
    />
  );
}

function TableHead({ style, ...props }: ComponentProps<"th">) {
  return (
    <th
      data-slot="table-head"
      style={{
        textAlign: "left",
        whiteSpace: "nowrap",
        ...style,
      }}
      {...props}
    >
      <Box padding="$s">
        <Text as="span" color="$secondary" fontWeight="$semiBold">
          {props.children}
        </Text>
      </Box>
    </th>
  );
}

function TableCell({ style, ...props }: ComponentProps<"td">) {
  return (
    <td
      data-slot="table-cell"
      style={{
        padding: "0.75rem",
        verticalAlign: "middle",
        ...style,
      }}
      {...props}
    >
      <Text as="span">{props.children}</Text>
    </td>
  );
}

export { Table, TableBody, TableCell, TableHead, TableHeader, TableRow };
