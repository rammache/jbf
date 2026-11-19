import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { prisma } from "../prisma.js";
import { hashPassword } from "../utils/password.js";
import { createAdminUserSchema, updateAdminUserSchema } from "../schemas/adminUser.js";

export const adminGetUsers = async (_req: Request, res: Response) => {
  try {
    const users = await prisma.adminUser.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: { createdAt: "asc" }
    });

    return res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Failed to list admin users:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to retrieve admin accounts"
    });
  }
};

export const adminCreateUser = async (req: Request, res: Response) => {
  try {
    const parsed = createAdminUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid admin account payload"
      });
    }

    const { name, email, password, role } = parsed.data;

    const existing = await prisma.adminUser.findUnique({
      where: { email }
    });

    if (existing) {
      return res.status(409).json({
        success: false,
        error: `An administrator with email "${email}" already exists.`
      });
    }

    const passwordHash = await hashPassword(password);

    const newUser = await prisma.adminUser.create({
      data: {
        name,
        email,
        passwordHash,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.status(201).json({
      success: true,
      message: "Admin account created successfully",
      data: newUser
    });
  } catch (error) {
    console.error("Failed to create admin user:", error);
    return res.status(500).json({
      success: false,
      error: "An unexpected error occurred while creating admin account"
    });
  }
};

export const adminUpdateUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: "Invalid admin user ID" });
    }

    const parsed = updateAdminUserSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: parsed.error.issues[0]?.message || "Invalid update payload"
      });
    }

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, error: "Admin user not found" });
    }

    // Guard: if changing role away from SUPER_ADMIN or demoting, ensure another SUPER_ADMIN exists
    if (target.role === "SUPER_ADMIN" && parsed.data.role && parsed.data.role !== "SUPER_ADMIN") {
      const superAdminCount = await prisma.adminUser.count({
        where: { role: "SUPER_ADMIN" }
      });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot demote the only remaining Super Administrator."
        });
      }
    }

    const updateData: Prisma.AdminUserUpdateInput = {};
    if (parsed.data.name) updateData.name = parsed.data.name;
    if (parsed.data.role) updateData.role = parsed.data.role;
    if (parsed.data.password) {
      updateData.passwordHash = await hashPassword(parsed.data.password);
    }

    const updated = await prisma.adminUser.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });

    return res.json({
      success: true,
      message: "Admin account updated successfully",
      data: updated
    });
  } catch (error) {
    console.error("Failed to update admin user:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to update admin user"
    });
  }
};

export const adminDeleteUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ success: false, error: "Invalid admin user ID" });
    }

    const currentAdminId = req.admin?.id;
    if (currentAdminId && currentAdminId === id) {
      return res.status(400).json({
        success: false,
        error: "You cannot delete your own admin account while signed in."
      });
    }

    const target = await prisma.adminUser.findUnique({ where: { id } });
    if (!target) {
      return res.status(404).json({ success: false, error: "Admin user not found" });
    }

    if (target.role === "SUPER_ADMIN") {
      const superAdminCount = await prisma.adminUser.count({
        where: { role: "SUPER_ADMIN" }
      });
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          error: "Cannot delete the only remaining Super Administrator."
        });
      }
    }

    await prisma.adminUser.delete({ where: { id } });

    return res.json({
      success: true,
      message: `Admin account "${target.name}" (${target.email}) deleted successfully.`
    });
  } catch (error) {
    console.error("Failed to delete admin user:", error);
    return res.status(500).json({
      success: false,
      error: "Unable to delete admin user"
    });
  }
};
