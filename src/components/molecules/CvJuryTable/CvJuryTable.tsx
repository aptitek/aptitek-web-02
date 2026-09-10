import React from "react";
import Box from "@mui/material/Box";
import styles from "./CvJuryTable.module.css";

export interface JuryMember {
  roleIcon: string;
  name: string;
  title: string;
  institution: string;
  institutionLogo?: string;
  institutionClass?: string;
  role: string;
  roleColor?: string;
}

export interface CvJuryTableProps {
  members?: JuryMember[];
  className?: string;
}

export const DEFAULT_JURY_MEMBERS: JuryMember[] = [
  {
    roleIcon: "👤",
    name: "Hamamache Kheddouci",
    title: "Professeur",
    institution: "LIRIS",
    institutionClass: "logo-liris",
    role: "Président",
    roleColor: "red",
  },
  {
    roleIcon: "📄",
    name: "Eva Onainda",
    title: "Professeure",
    institution: "Universitat Politècnica De València",
    institutionLogo: "/cv/icons/updv.svg",
    role: "Rapporteuse",
    roleColor: "magenta",
  },
  {
    roleIcon: "📄",
    name: "Damien Pellier",
    title: "Professeur Associé",
    institution: "LIG",
    institutionLogo: "/cv/icons/lig.svg",
    role: "Rapporteur",
    roleColor: "magenta",
  },
  {
    roleIcon: "👁️",
    name: "Ivan Varzinczac",
    title: "Professeur Associé",
    institution: "cril",
    institutionLogo: "/cv/icons/cril.svg",
    role: "Examinateur",
    roleColor: "blue",
  },
  {
    roleIcon: "🎓",
    name: "Samir Aknine",
    title: "Professeur",
    institution: "LIRIS",
    institutionClass: "logo-liris",
    role: "Directeur de thèse",
    roleColor: "green",
  },
  {
    roleIcon: "👥",
    name: "Lætitia Matignon",
    title: "Professeure Associée",
    institution: "LIRIS",
    institutionClass: "logo-liris",
    role: "Co-directrice de thèse",
    roleColor: "green",
  },
];

export const CvJuryTable: React.FC<CvJuryTableProps> = ({
  members = DEFAULT_JURY_MEMBERS,
  className = "",
}) => {
  return (
    <div className={`${styles.tableWrapper} ${className}`.trim()}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.thIcon} aria-label="Icône" />
            <th className={styles.thName}>Nom</th>
            <th className={styles.thTitle}>Titre</th>
            <th className={styles.thInstitution}>Institution</th>
            <th className={styles.thRole}>Rôle</th>
          </tr>
        </thead>
        <tbody>
          {members.map((member) => {
            const roleColorClass = member.roleColor
              ? styles[`color-${member.roleColor}`]
              : "";
            const iconClassName = [styles.roleIcon, roleColorClass]
              .filter(Boolean)
              .join(" ");
            const badgeColorClass = member.roleColor
              ? styles[`role-${member.roleColor}`]
              : "";
            const badgeClassName = [styles.roleBadge, badgeColorClass]
              .filter(Boolean)
              .join(" ");

            return (
              <tr key={member.name} className={styles.row}>
                <td className={styles.tdIcon}>
                  <span className={iconClassName}>{member.roleIcon}</span>
                </td>
                <td className={styles.tdName}>
                  <strong>{member.name}</strong>
                </td>
                <td className={styles.tdTitle}>{member.title}</td>
                <td className={styles.tdInstitution}>
                  {member.institutionLogo ? (
                    <Box
                      component="img"
                      src={member.institutionLogo}
                      alt={member.institution}
                      loading="lazy"
                      decoding="async"
                      className={styles.instLogo}
                    />
                  ) : (
                    <span
                      className={member.institutionClass || styles.instText}
                    >
                      {member.institution}
                    </span>
                  )}
                </td>
                <td className={styles.tdRole}>
                  <span className={badgeClassName}>{member.role}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
