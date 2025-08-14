"use client";
import React, { useId, useMemo, useState } from "react";
import type {
  Question,
  QuestionType,
  SurveyDraft,
  ShortTextQuestion,
  LongTextQuestion,
  YesNoQuestion,
  RatingQuestion,
  SelectQuestion,
} from "@/types/survey";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Select from "@/components/ui/Select";

function cuid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

const TEMPLATE_BY_TYPE: { [K in QuestionType]: () => Extract<Question, { type: K }> } = {
  short_text: () => ({
    id: cuid(),
    type: "short_text",
    label: "Short answer",
    required: false,
    helpText: "",
    placeholder: "",
  }),
  long_text: () => ({
    id: cuid(),
    type: "long_text",
    label: "Long answer",
    required: false,
    helpText: "",
    placeholder: "",
  }),
  yes_no: () => ({
    id: cuid(),
    type: "yes_no",
    label: "Yes / No",
    required: false,
    helpText: "",
  }),
  rating: () => ({
    id: cuid(),
    type: "rating",
    label: "Rating",
    required: false,
    helpText: "",
    max: 5,
  }),
  select: () => ({
    id: cuid(),
    type: "select",
    label: "Select",
    required: false,
    helpText: "",
    options: ["Option 1"],
    multiple: false,
  }),
};

type Props = { initial?: Partial<SurveyDraft> };

export default function SurveyBuilder({ initial }: Props) {
  const formId = useId();
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [status, setStatus] = useState<"DRAFT" | "PUBLISHED" | "ARCHIVED">(initial?.status ?? "DRAFT");
  const [allowAnon, setAllowAnon] = useState<boolean>(initial?.allowAnon ?? true);
  const [startsAt, setStartsAt] = useState<string>(initial?.startsAt ?? "");
  const [endsAt, setEndsAt] = useState<string>(initial?.endsAt ?? "");
  const [questions, setQuestions] = useState<Question[]>(initial?.questions ?? []);

  function addQuestion(type: QuestionType) { setQuestions(qs => [...qs, TEMPLATE_BY_TYPE[type]()]); }
  function updateQuestion(id: string, patch: Partial<ShortTextQuestion>): void;
  function updateQuestion(id: string, patch: Partial<LongTextQuestion>): void;
  function updateQuestion(id: string, patch: Partial<YesNoQuestion>): void;
  function updateQuestion(id: string, patch: Partial<RatingQuestion>): void;
  function updateQuestion(id: string, patch: Partial<SelectQuestion>): void;
  function updateQuestion(id: string, patch: Partial<Question>) {
    setQuestions(qs => qs.map(q => (q.id === id ? ({ ...q, ...patch } as Question) : q)));
  }
  function removeQuestion(id: string) { setQuestions(qs => qs.filter(q => q.id !== id)); }
  function moveQuestion(id: string, dir: -1 | 1) {
    setQuestions(qs => {
      const i = qs.findIndex(q => q.id === id);
      const j = i + dir;
      if (i < 0 || j < 0 || j >= qs.length) return qs;
      const copy = [...qs];
      [copy[i], copy[j]] = [copy[j], copy[i]];
      return copy;
    });
  }

  const asDraft: SurveyDraft = useMemo(() => ({
    title, description, status, allowAnon,
    startsAt: startsAt || undefined,
    endsAt: endsAt || undefined,
    questions,
  }), [title, description, status, allowAnon, startsAt, endsAt, questions]);

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm">Title</label>
          <Input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Resident Satisfaction – Week 32" required />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Status</label>
          <Select value={status} onChange={(e)=>setStatus(e.target.value as "DRAFT" | "PUBLISHED" | "ARCHIVED")}>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </Select>
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm">Description</label>
          <Textarea rows={3} value={description} onChange={e=>setDescription(e.target.value)} placeholder="Optional context for participants…" />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Opens</label>
          <Input type="datetime-local" value={startsAt} onChange={e=>setStartsAt(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="text-sm">Closes</label>
          <Input type="datetime-local" value={endsAt} onChange={e=>setEndsAt(e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm md:col-span-2">
          <input type="checkbox" checked={allowAnon} onChange={e=>setAllowAnon(e.target.checked)} />
          Allow anonymous responses
        </label>
      </section>

      <section className="space-y-3">
        <div className="text-sm">Add question</div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={()=>addQuestion("short_text")}>Short text</Button>
          <Button type="button" variant="secondary" onClick={()=>addQuestion("long_text")}>Long text</Button>
          <Button type="button" variant="secondary" onClick={()=>addQuestion("yes_no")}>Yes / No</Button>
          <Button type="button" variant="secondary" onClick={()=>addQuestion("rating")}>Rating</Button>
          <Button type="button" variant="secondary" onClick={()=>addQuestion("select")}>Select</Button>
        </div>
      </section>

      <section className="space-y-3">
        {questions.length === 0 && <div className="text-sm text-teal-100/70">No questions yet — add some above.</div>}
        <ul className="space-y-3">
          {questions.map((q, i) => (
            <li key={q.id} className="bg-panel border border-panel rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="text-xs uppercase tracking-wider text-teal-100/70">{q.type.replace("_"," ")}</div>
                <div className="flex gap-2">
                  <Button type="button" variant="secondary" onClick={()=>moveQuestion(q.id, -1)} disabled={i===0}>↑</Button>
                  <Button type="button" variant="secondary" onClick={()=>moveQuestion(q.id, +1)} disabled={i===questions.length-1}>↓</Button>
                  <Button type="button" variant="danger" onClick={()=>removeQuestion(q.id)}>Remove</Button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3 mt-3">
                <div className="space-y-2">
                  <label className="text-sm">Label</label>
                  <Input value={q.label} onChange={(e)=>updateQuestion(q.id, { label: e.target.value })} />
                </div>
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={!!q.required} onChange={e=>updateQuestion(q.id, { required: e.target.checked })} />
                  Required
                </label>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm">Help text</label>
                  <Input value={q.helpText ?? ""} onChange={(e)=>updateQuestion(q.id, { helpText: e.target.value })} placeholder="Shown under the label (optional)" />
                </div>

                  {(q.type === "short_text" || q.type === "long_text") && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm">Placeholder</label>
                      <Input value={q.placeholder ?? ""} onChange={(e)=>updateQuestion(q.id, { placeholder: e.target.value })} />
                    </div>
                  )}

                  {q.type === "rating" && (
                    <div className="space-y-2">
                      <label className="text-sm">Max</label>
                      <Input type="number" min={3} max={10} value={q.max ?? 5} onChange={(e)=>updateQuestion(q.id, { max: Number(e.target.value) })} />
                    </div>
                  )}

                  {q.type === "select" && (
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm">Options (comma‑separated)</label>
                      <Input value={q.options?.join(", ") ?? ""} onChange={(e)=>updateQuestion(q.id, { options: e.target.value.split(",").map(s=>s.trim()).filter(Boolean) })} placeholder="Yes, No, Maybe" />
                      <label className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={!!q.multiple} onChange={(e)=>updateQuestion(q.id, { multiple: e.target.checked })} />
                        Allow multiple selection
                      </label>
                    </div>
                  )}
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* Hidden serializer for the server action form on the page */}
      <input type="hidden" name="draft" value={JSON.stringify(asDraft)} form={formId} />
    </div>
  );
}
