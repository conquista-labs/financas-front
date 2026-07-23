import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import type { MeioPagamento } from "@/domain/models";
import type { ComboboxOption } from "@/presentation/components";
import {
  useAnalisarImportacao,
  useConfirmarImportacao,
  useGetCategorias,
  useGetEnums,
  useGetMeiosPagamento,
  useGetPessoas,
} from "@/presentation/hooks/api";
import { urlRouters } from "@/presentation/router/router.definitions";

import {
  AnalyzingStep,
  ImportStepper,
  ReviewStep,
  UploadStep,
} from "./components";
import {
  normalizeTag,
  type ReviewLine,
  toConfirmacao,
  toReviewLines,
} from "./import.helpers";

const OPT_LIMIT = { page: 1, limit: 100 };

type Step = "upload" | "analyzing" | "review";

/**
 * Importar extrato — wizard de 3 passos (Enviar → Revisar → Confirmar). Envia o
 * arquivo para análise, deixa o usuário revisar/editar as transações detectadas
 * e confirma persistindo tudo com uma tag em lote opcional.
 */
const Import = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("upload");
  const [fileName, setFileName] = useState("");
  const [lines, setLines] = useState<ReviewLine[]>([]);
  const [tag, setTag] = useState("");

  const analisar = useAnalisarImportacao();
  const confirmar = useConfirmarImportacao();

  // Listas para os selects de revisão (categoria/pessoa/meio/forma).
  const categorias = useGetCategorias(OPT_LIMIT);
  const pessoas = useGetPessoas(OPT_LIMIT);
  const meios = useGetMeiosPagamento(OPT_LIMIT);
  const enums = useGetEnums();

  const categoriaOpts = useMemo<ComboboxOption[]>(
    () =>
      (categorias.data?.data?.rows ?? []).map((c) => ({
        value: c.id,
        label: c.nome,
      })),
    [categorias.data],
  );
  const pessoaOpts = useMemo<ComboboxOption[]>(
    () =>
      (pessoas.data?.data?.rows ?? []).map((p) => ({
        value: p.id,
        label: p.nome,
      })),
    [pessoas.data],
  );
  const meioOpts = useMemo<ComboboxOption[]>(
    () =>
      ((meios.data?.data?.rows ?? []) as MeioPagamento[]).map((m) => ({
        value: m.id,
        label: m.nome,
      })),
    [meios.data],
  );
  const formaOpts = useMemo<ComboboxOption[]>(
    () =>
      (enums.data?.data?.formaPagamento ?? []).map((f) => ({
        value: f.value ?? "",
        label: f.label ?? "",
      })),
    [enums.data],
  );

  const handleFile = (file: File) => {
    setFileName(file.name);
    setStep("analyzing");
    analisar.mutate(
      { file },
      {
        onSuccess: (res) => {
          setLines(toReviewLines(res.data.linhas));
          setStep("review");
        },
        onError: () => {
          toast.error("Não consegui ler esse extrato. Tente outro arquivo.");
          setStep("upload");
        },
      },
    );
  };

  const toggleLine = (key: string) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, incluir: !l.incluir } : l)),
    );

  const changeLine = (key: string, patch: Partial<ReviewLine>) =>
    setLines((prev) =>
      prev.map((l) => (l.key === key ? { ...l, ...patch } : l)),
    );

  const reset = () => {
    setStep("upload");
    setFileName("");
    setLines([]);
    setTag("");
  };

  const handleConfirm = () => {
    const incluidas = lines.filter((l) => l.incluir);
    if (!incluidas.length) return;

    confirmar.mutate(
      {
        linhas: incluidas.map(toConfirmacao),
        ...(normalizeTag(tag) ? { tagEmLote: normalizeTag(tag) } : {}),
      },
      {
        onSuccess: () => {
          toast.success(
            `${incluidas.length} transaç${incluidas.length === 1 ? "ão importada" : "ões importadas"} ✓`,
          );
          reset();
          navigate(urlRouters.transactions);
        },
        onError: () => toast.error("Não consegui importar. Tente novamente."),
      },
    );
  };

  const stepIndex = step === "upload" ? 0 : step === "analyzing" ? 1 : 2;

  return (
    <div className="animate-om-fade">
      <div className="mb-1">
        <h1 className="font-display text-[30px] font-bold -tracking-[0.025em] text-fg">
          Importar extrato
        </h1>
        <p className="mt-1 text-sm text-muted">
          Suba um PDF, foto/print ou CSV do banco. A gente lê, sugere categoria
          e você revisa antes de salvar.
        </p>
      </div>

      <div className="my-6">
        <ImportStepper step={stepIndex} />
      </div>

      {step === "upload" && <UploadStep onFile={handleFile} />}
      {step === "analyzing" && <AnalyzingStep fileName={fileName} />}
      {step === "review" && (
        <ReviewStep
          fileName={fileName}
          lines={lines}
          categorias={categoriaOpts}
          pessoas={pessoaOpts}
          meios={meioOpts}
          formas={formaOpts}
          tag={tag}
          onTagChange={setTag}
          onToggle={toggleLine}
          onChangeLine={changeLine}
          onCancel={reset}
          onConfirm={handleConfirm}
          isConfirming={confirmar.isPending}
        />
      )}
    </div>
  );
};

export default Import;
