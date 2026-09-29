import {updateEnquiryStatus} from "@/app/admin/actions";
export default function EnquiryFollowUp({id, status, consentAt, consentText}: {id: string; status: string; consentAt: Date | null; consentText: string | null}) {
  return <div className="mt-5">
    {consentAt && <details className="mb-4 text-sm"><summary>Contact consent confirmed {consentAt.toLocaleString("en-GB")}</summary><p className="mt-2 whitespace-pre-line">{consentText}</p></details>}
    <form action={updateEnquiryStatus} className="flex flex-wrap items-center gap-3">
      <input type="hidden" name="id" value={id}/>
      <label className="text-sm">Follow-up status <select name="status" defaultValue={status} className="ml-2 rounded border bg-white p-2">
        {["New", "Reviewed", "Qualified", "Contacted", "Closed"].map(value => <option key={value}>{value}</option>)}
      </select></label>
      <button className="text-xs uppercase tracking-widest text-gold">Update status →</button>
    </form>
  </div>;
}
