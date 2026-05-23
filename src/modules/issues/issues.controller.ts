import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  createIssueSchema,
  updateIssueSchema
} from "./issues.validation";

import {
  createIssue,
  deleteIssue,
  getAllIssues,
  getSingleIssue,
  updateIssue
} from "./issues.service";
import type { AuthRequest } from "../../middleware/auth.middleware";

export const createIssueController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const parsed = createIssueSchema.parse(req.body);

    const issue = await createIssue(
      parsed,
      req.user.id
    );

    res.status(StatusCodes.CREATED).json({
      success: true,
      message: "Issue created successfully",
      data: issue
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

export const getAllIssuesController = async (
  req: Request,
  res: Response
) => {
  try {
    const { sort, type, status } = req.query;

    const issues = await getAllIssues(
      sort as string,
      type as string,
      status as string
    );

    res.status(StatusCodes.OK).json({
      success: true,
      data: issues
    });
  } catch (error: any) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: error.message
    });
  }
};

export const getSingleIssueController = async (
  req: Request,
  res: Response
) => {
  const issue = await getSingleIssue(
    Number(req.params.id)
  );

  if (!issue) {
    return res.status(StatusCodes.NOT_FOUND).json({
      success: false,
      message: "Issue not found"
    });
  }

  res.status(StatusCodes.OK).json({
    success: true,
    data: issue
  });
};

export const updateIssueController = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const parsed = updateIssueSchema.parse(req.body);

    const existingIssue = await getSingleIssue(
      Number(req.params.id)
    );

    if (!existingIssue) {
      return res.status(StatusCodes.NOT_FOUND).json({
        success: false,
        message: "Issue not found"
      });
    }

    if (req.user.role === "contributor") {
      if (
        existingIssue.reporter_id !== req.user.id
      ) {
        return res.status(StatusCodes.FORBIDDEN).json({
          success: false,
          message: "Forbidden"
        });
      }

      if (existingIssue.status !== "open") {
        return res.status(StatusCodes.CONFLICT).json({
          success: false,
          message:
            "Cannot edit non-open issue"
        });
      }

      delete parsed.status;
    }

    const updated = await updateIssue(
      Number(req.params.id),
      parsed
    );

    res.status(StatusCodes.OK).json({
      success: true,
      message: "Issue updated successfully",
      data: updated
    });
  } catch (error: any) {
    res.status(StatusCodes.BAD_REQUEST).json({
      success: false,
      message: error.message
    });
  }
};

export const deleteIssueController = async (
  req: Request,
  res: Response
) => {
  await deleteIssue(Number(req.params.id));

  res.status(StatusCodes.OK).json({
    success: true,
    message: "Issue deleted successfully"
  });
};