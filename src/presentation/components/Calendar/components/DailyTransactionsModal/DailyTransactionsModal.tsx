import { Box, Text, Modal } from "@rarui-react/components";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import { formatCurrency } from "@/presentation/pages/Home/home.definitions";

import type { DailyTransactionsModalProps } from "./dailyTransactionsModal.types";

const DailyTransactionsModal: React.FC<DailyTransactionsModalProps> = ({
  open,
  onClose,
  dayData,
}) => {
  return (
    <Modal
      open={open}
      onDismiss={onClose}
      maxWidth={{ xs: "90%", md: "600px" }}
    >
      <Modal.Header
        title={
          dayData
            ? `Transações - ${format(new Date(dayData.data), "dd/MM/yyyy", { locale: ptBR })}`
            : "Transações do Dia"
        }
      />
      <Modal.Body>
        {dayData && (
          <Box display="flex" flexDirection="column" gap="$xs">
            {dayData.transacoes.map((transacao, index) => (
              <Box
                key={`modal-${dayData.data}-${index}`}
                padding="$xs"
                borderRadius="$xs"
                borderWidth="$1"
                borderStyle="solid"
                borderColor="$divider"
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <Box display="flex" alignItems="center" gap="$xs">
                  <div
                    style={{
                      height: "20px",
                      width: "4px",
                      borderRadius: "2px",
                      backgroundColor: `${transacao.categoria?.cor}`,
                    }}
                  />
                  <Box display="flex" flexDirection="column" gap="$4xs">
                    <Text fontSize="$s" fontWeight="$semiBold" color="$primary">
                      {transacao.descricao}
                    </Text>
                    <Text fontSize="$xs" color="$secondary">
                      {transacao.categoria?.nome} • {transacao.pessoa?.nome}
                    </Text>
                  </Box>
                </Box>
                <Box
                  display="flex"
                  flexDirection="column"
                  alignItems="flex-end"
                  gap="$4xs"
                >
                  <Text
                    fontSize="$s"
                    fontWeight="$bold"
                    color={transacao.tipo === "receita" ? "$success" : "$error"}
                  >
                    {transacao.tipo === "receita" ? "+" : "-"}
                    {formatCurrency(transacao.valor)}
                  </Text>
                  {transacao.meioPagamento && (
                    <Text fontSize="$xs" color="$secondary">
                      {transacao.meioPagamento.nome}
                    </Text>
                  )}
                </Box>
              </Box>
            ))}

            {/* Resumo do dia */}
            <Box
              marginTop="$xs"
              paddingY="$md"
              paddingX="$xs"
              borderRadius="$xs"
              backgroundColor="$background"
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Text fontSize="$m" fontWeight="$bold" color="$primary">
                Total:
              </Text>
              <Text fontSize="$m" fontWeight="$bold" color="$error">
                {formatCurrency(dayData.totalDespesas)}
              </Text>
            </Box>
          </Box>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DailyTransactionsModal;
