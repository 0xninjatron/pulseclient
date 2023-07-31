import { waitForTransactionReceipt } from "./web3init";
import { shortenTxnHash } from "./util";

export interface DialogState {
  visible: boolean;
  msg: string;
  showSpinner: boolean;
  pendingTxnHash: string;
  modalMode: boolean;
}


export const handleTransaction = async (
  modal: DialogState,
  transactionPromiseFunc: () => Promise<string>,
) => {
  try {
    modal.modalMode = true;
    modal.msg = "Waiting on pending txn hash...";
    modal.showSpinner = true;
    modal.visible = true;
    const pendingListTxn = await transactionPromiseFunc();

    modal.pendingTxnHash = pendingListTxn;
    modal.msg = `Transaction ${shortenTxnHash(
      pendingListTxn
    )} submitted. Waiting for confirmation...`;

    await waitForTransactionReceipt(pendingListTxn);

    modal.msg =
      "Transaction " + shortenTxnHash(pendingListTxn) + " confirmed!";
  } catch (error) {
    modal.msg = "An error occurred: " + (error as any).message;
  } finally {
    modal.showSpinner = false;
    modal.modalMode = false;
  }
};
