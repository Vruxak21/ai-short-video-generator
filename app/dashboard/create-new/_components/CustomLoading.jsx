import React from "react";
import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogTitle,
} from "@/@/components/ui/alert-dialog";
import Image from "next/image";

function CustomLoading({ loading }) {
  return (
    <AlertDialog open={loading}>
      <AlertDialogOverlay className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="bg-white flex flex-col items-center my-10 justify-center rounded-lg w-1/4 h-1/4">
          <Image src={'/progress.gif'} width={100} height={100} alt="loading"/>
          <h2>Generating your video... Do not Refresh</h2>
        </div>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}

export default CustomLoading;
