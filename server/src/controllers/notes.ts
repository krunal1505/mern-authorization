import { RequestHandler } from "express";
import NoteModel from "../models/noteModel";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    const notes = await NoteModel.find().exec();
    res.status(200).json(notes);
  } catch (error) {
    next(error);
  }
};

export const getNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid ID");
    }
    const note = await NoteModel.findById(id).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(note);
  } catch (error) {
    next(error);
  }
};

interface CreateNoteBody {
  title?: string;
  text?: string;
}

export const createNote: RequestHandler<
  unknown,
  unknown,
  CreateNoteBody,
  unknown
> = async (req, res, next) => {
  try {
    const { title, text } = req.body;
    if (!title) {
      throw createHttpError(400, "Title is required");
    }
    const newNote = await NoteModel.create({ title, text });
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

interface UpdateNoteParams {
  id: string;
}
interface UpdateNoteBody {
  title?: string;
  text?: string;
}

export const updateNote: RequestHandler<
  UpdateNoteParams,
  unknown,
  UpdateNoteBody,
  unknown
> = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, text } = req.body;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid ID");
    }
    if (!title) {
      throw createHttpError(400, "Title is required");
    }

    const note = await NoteModel.findById(id).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    note.title = title;
    note.text = text;

    const updatedNote = await note.save();
    res.status(200).json(updatedNote);
  } catch (error) {
    next(error);
  }
};

export const deleteNote: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      throw createHttpError(400, "Invalid ID");
    }

    const note = await NoteModel.findById(id).exec();
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    await note.deleteOne();
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};
